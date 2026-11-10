import json
import re
import os

transcript_path = r'C:\Users\Admin\.gemini\antigravity\brain\640f9ba8-6845-4624-813c-458af7fbbafd\.system_generated\logs\transcript_full.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    data = json.loads(f.readline())
content = data.get('content', '')

anchors = [
    ('Paying Tax', 'paying-tax.ts', 'payingTaxQuiz', 'lm-paying-tax', 'Paying Tax', 'Life Skills', 'KRA, PAYE, VAT, reliefs, and civic responsibility', content.find('Paying Tax\nLesson 1')),
    ('Paying for University/College', 'paying-for-college.ts', 'payingForCollegeQuiz', 'lm-paying-for-college', 'Paying for College', 'Life Skills', 'HELB loans, HEF portal, scholarships, and campus budgeting', content.find('Paying for University/College\nLesson 1')),
    ('Insurance', 'insurance.ts', 'insuranceQuiz', 'lm-insurance', 'Insurance & Risk', 'Life Skills', 'Risk pooling, SHA/SHIF, auto policies, and financial shields', content.find('Insurance\nWhat is Insurance:')),
    ('Planning for Retirement', 'planning-for-retirement.ts', 'planningForRetirementQuiz', 'lm-retirement', 'Planning for Retirement', 'Life Skills', 'Pensions, NSSF compounding, employer match, and golden years', content.find('Planning for Retirement\nLesson 1')),
    ('Social Security', 'social-security.ts', 'socialSecurityQuiz', 'lm-social-security', 'Social Security', 'Life Skills', 'Inua Jamii, cash transfers, safety nets, and constitutional rights', content.find('Social Security\nLesson 1')),
    ('Predatory Digital Lending Apps', 'predatory-lending.ts', 'predatoryLendingQuiz', 'lm-predatory-lending', 'Predatory Lending Apps', 'Life Skills', 'Loan app traps, high APR, privacy extortion, and CRB', content.find('Predatory Digital Lending Apps\nLesson 1'))
]

def escape_ts(s):
    return json.dumps(s.strip(), ensure_ascii=False)

def parse_section_lessons(name, raw_content):
    if name == 'Insurance':
        raw = re.sub(r'^Insurance\s*\n\s*What is Insurance:', 'Lesson 1\nWhat is Insurance:', raw_content.strip())
    else:
        raw = re.sub(r'^[^\n]*\n', '', raw_content.strip())
        
    blocks = re.split(r'\n(?=Lesson\s+\d+)', raw)
    blocks = [b.strip() for b in blocks if b.strip().startswith('Lesson')]
    
    lessons = []
    for b in blocks:
        lines = [l.strip() for l in b.strip().split('\n') if l.strip()]
        l_num = int(re.search(r'\d+', lines[0]).group())
        
        # Preprocess lines in this block to handle edge cases
        norm_lines = []
        for l in lines[1:]:
            if 'B) Yes, but the system will charge her a 50% penalty fee for paying early C) No, all payments must be done' in l:
                norm_lines.append('B) Yes, but the system will charge her a 50% penalty fee for paying early')
                norm_lines.append('C) No, all payments must be done using corporate company bank transfers only')
            elif 'C) It calculates to a predatory annual percentage rate (APR) of over 260%, which is significantly higher than any regulated bank loan D) It is an asset' in l:
                norm_lines.append('C) It calculates to a predatory annual percentage rate (APR) of over 260%, which is significantly higher than any regulated bank loan')
                norm_lines.append('D) It is an asset because you plan to pay the loan the same day that you get the loan')
            elif name == 'Paying Tax' and l_num == 17 and l.startswith('Log into the iTax portal'):
                norm_lines.append('A) ' + l)
            elif name == 'Paying Tax' and l_num == 17 and l.startswith('Ignore the deadline'):
                norm_lines.append('B) ' + l)
            elif name == 'Paying Tax' and l_num == 24 and l.startswith('To fund the expansion'):
                norm_lines.append('A) ' + l)
            elif name == 'Paying Tax' and l_num == 24 and l.startswith('To pay for the construction'):
                norm_lines.append('B) ' + l)
            elif name == 'Predatory Digital Lending Apps' and l_num == 7 and 'Recognize it as illegal intimidation' in l and len(norm_lines) > 0 and 'Recognize it as illegal intimidation' in norm_lines[-1]:
                norm_lines.append('B) Prepare to go to prison because the police will come for him')
            else:
                norm_lines.append(l)
                
        # Parse title & body
        title_body = norm_lines[0]
        if ':' in title_body:
            title, body = title_body.split(':', 1)
            title = title.strip()
            body = body.strip()
        else:
            title = f'Lesson {l_num}'
            body = title_body.strip()
            
        title = re.sub(r'\s*\?\s*$', '?', title)
        
        # Find Question line
        q_idx = -1
        for i, l in enumerate(norm_lines):
            if l.startswith('Question:'):
                q_idx = i
                break
                
        if q_idx > 1:
            body = ' '.join([body] + norm_lines[1:q_idx])
            
        q_text = norm_lines[q_idx].replace('Question:', '').strip()
        
        # Find Correct Answer:
        ca_idx = -1
        for i in range(q_idx + 1, len(norm_lines)):
            if norm_lines[i].startswith('Correct Answer:'):
                ca_idx = i
                break
                
        # Parse options
        options = []
        for ml in norm_lines[q_idx+1:ca_idx]:
            m_opt = re.match(r'^([A-D])\)\s*(.*)', ml)
            if m_opt:
                options.append(m_opt.group(2).strip())
            else:
                if not options:
                    q_text += ' ' + ml
                else:
                    options[-1] += ' ' + ml
                    
        ca_line = norm_lines[ca_idx]
        m_ca = re.search(r'Correct Answer:\s*([A-D])\)', ca_line)
        corr_idx = ord(m_ca.group(1)) - ord('A') if m_ca else 0
        if name == 'Predatory Digital Lending Apps' and l_num == 7:
            corr_idx = 0
            
        # Parse explanation (Success) & tryAgain
        succ = ''
        try_again = ''
        for ml in norm_lines[ca_idx+1:]:
            if ml.startswith('Success:'):
                succ = ml.replace('Success:', '').strip()
            elif ml.startswith('Try Again:'):
                try_again = ml.replace('Try Again:', '').strip()
            elif try_again:
                try_again += ' ' + ml
            elif succ:
                succ += ' ' + ml
                
        if name == 'Predatory Digital Lending Apps' and l_num == 12:
            succ = 'Correct! Just like grades reflect academic performance, your CRB score reflects your borrowing reliability and debt compliance.'
            try_again = 'Think about long-term track records. A report card summarizes your academic performance over time, just as a credit score summarizes your borrowing habits.'
            
        clean_opts = []
        for opt in options:
            clean_opt = re.sub(r'\s+', ' ', opt).strip()
            clean_opts.append(clean_opt)
            
        lessons.append({
            'id': l_num,
            'title': title,
            'body': re.sub(r'\s+', ' ', body).strip(),
            'question': re.sub(r'\s+', ' ', q_text).strip(),
            'options': clean_opts,
            'correctIndex': corr_idx,
            'explanation': re.sub(r'\s+', ' ', succ).strip(),
            'tryAgain': re.sub(r'\s+', ' ', try_again).strip(),
        })
    return lessons

output_dir = r'C:\Users\Admin\code\letter\client\src\games\life-money'

for i in range(len(anchors)):
    name, filename, export_var, quiz_id, quiz_title, quiz_topic, quiz_theme, start = anchors[i]
    end = anchors[i+1][7] if i+1 < len(anchors) else len(content)
    raw = content[start:end]
    lessons = parse_section_lessons(name, raw)
    print(f'Generating {filename} with {len(lessons)} questions...')
    
    ts_code = 'import { lessonQuiz, q } from "./helpers";\n\n'
    ts_code += f'export const {export_var} = lessonQuiz(\n'
    ts_code += f'  {escape_ts(quiz_id)},\n'
    ts_code += f'  {escape_ts(quiz_title)},\n'
    ts_code += f'  {escape_ts(quiz_topic)},\n'
    ts_code += f'  {escape_ts(quiz_theme)},\n'
    ts_code += '  [\n'
    
    for l in lessons:
        ts_code += '    q(\n'
        ts_code += f'      {l["id"]},\n'
        ts_code += f'      {escape_ts(l["title"])},\n'
        ts_code += f'      {escape_ts(l["body"])},\n'
        ts_code += f'      {escape_ts(l["question"])},\n'
        ts_code += '      [\n'
        for opt in l['options']:
            ts_code += f'        {escape_ts(opt)},\n'
        ts_code += '      ],\n'
        ts_code += f'      {l["correctIndex"]},\n'
        ts_code += f'      {escape_ts(l["explanation"])},\n'
        ts_code += f'      {escape_ts(l["tryAgain"])},\n'
        ts_code += '    ),\n'
        
    ts_code += '  ],\n);\n'
    
    file_path = os.path.join(output_dir, filename)
    with open(file_path, 'w', encoding='utf-8') as f_out:
        f_out.write(ts_code)
    print(f'Successfully wrote {file_path} ({len(ts_code)} bytes)')

print('All 6 files generated successfully!')
