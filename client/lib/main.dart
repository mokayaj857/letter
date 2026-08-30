import 'dart:math' as math;
import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(fontFamily: 'Poppins', useMaterial3: true),
      home: const ProfileScreen(),
    );
  }
}

// ================= COLORS =================
class AppColors {
  static const bg = Color(0xFFE7F5EC);
  static const cardWhite = Color(0xFFFFFFFF);
  static const darkGreen = Color(0xFF1F5138);
  static const midGreen = Color(0xFF2E7D5B);
  static const mintCircle = Color(0xFFCFEEDD);
  static const grayText = Color(0xFF8A9A93);
  static const orange = Color(0xFFE8622C);
  static const avatarRing = Color(0xFF6FCF9A);
  static const avatarBg = Color(0xFFF6C453);
  static const toggleGreen = Color(0xFF3CCB6E);
  static const navInactive = Color(0xFFB7C4BD);
  static const sparkleYellow = Color(0xFFFFD873);
  static const blobMint = Color(0xFFBFE8D2);
  static const blobYellow = Color(0xFFFCE7B0);
  static const blobPink = Color(0xFFF6D3CC);
}

// ================= REUSABLE: BOUNCY TAP =================
// Wraps any child with a satisfying squish-down / spring-back tap effect.
class BouncyTap extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  const BouncyTap({super.key, required this.child, this.onTap});

  @override
  State<BouncyTap> createState() => _BouncyTapState();
}

class _BouncyTapState extends State<BouncyTap> {
  double _scale = 1.0;

  void _setScale(double s) => setState(() => _scale = s);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _setScale(0.92),
      onTapUp: (_) => _setScale(1.0),
      onTapCancel: () => _setScale(1.0),
      onTap: widget.onTap,
      child: AnimatedScale(
        scale: _scale,
        duration: const Duration(milliseconds: 220),
        curve: Curves.elasticOut,
        child: widget.child,
      ),
    );
  }
}

// ================= REUSABLE: STAGGERED FADE/SLIDE =================
Widget staggered({
  required Animation<double> parent,
  required double start,
  double end = 0,
  double dy = 22,
  double dx = 0,
  double scaleFrom = 1.0,
  Curve curve = Curves.easeOutCubic,
  required Widget child,
}) {
  final e = (end == 0) ? (start + 0.45).clamp(0.0, 1.0) : end;
  final curved = CurvedAnimation(
    parent: parent,
    curve: Interval(start.clamp(0.0, 1.0), e, curve: curve),
  );
  return AnimatedBuilder(
    animation: curved,
    builder: (context, _) {
      final v = curved.value;
      return Opacity(
        opacity: v.clamp(0.0, 1.0),
        child: Transform.translate(
          offset: Offset(dx * (1 - v), dy * (1 - v)),
          child: Transform.scale(
            scale: scaleFrom + (1 - scaleFrom) * v,
            child: child,
          ),
        ),
      );
    },
  );
}

// ================= PROFILE SCREEN =================
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen>
    with TickerProviderStateMixin {
  late final AnimationController _entrance;
  late final AnimationController _loop; // shared continuous loop (breathing, sparkles, blobs, wave)
  bool _notifOn = true;

  @override
  void initState() {
    super.initState();
    _entrance = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..forward();
    _loop = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 6),
    )..repeat();
  }

  @override
  void dispose() {
    _entrance.dispose();
    _loop.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      body: Stack(
        children: [
          // Drifting soft background blobs for a playful atmosphere
          Positioned.fill(
            child: AnimatedBuilder(
              animation: _loop,
              builder: (context, _) => CustomPaint(
                painter: _BlobPainter(_loop.value),
              ),
            ),
          ),
          SafeArea(
            child: Column(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        staggered(
                          parent: _entrance,
                          start: 0.0,
                          dy: -14,
                          child: _TopBar(loop: _loop),
                        ),
                        const SizedBox(height: 14),
                        Center(
                          child: staggered(
                            parent: _entrance,
                            start: 0.05,
                            end: 0.55,
                            scaleFrom: 0.4,
                            curve: Curves.elasticOut,
                            child: _AnimatedAvatar(loop: _loop),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Center(
                          child: staggered(
                            parent: _entrance,
                            start: 0.25,
                            child: const _NameRow(),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Center(
                          child: staggered(
                            parent: _entrance,
                            start: 0.3,
                            child: const Text(
                              'Saving superstar · Nairobi',
                              style: const TextStyle(
                                color: AppColors.grayText,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        Row(
                          children: [
                            Expanded(
                              child: staggered(
                                parent: _entrance,
                                start: 0.32,
                                dy: 30,
                                child: const _StatCard(
                                  icon: Icons.star_rounded,
                                  iconColor: Color(0xFF3FAE6B),
                                  value: 7,
                                  label: 'Level',
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: staggered(
                                parent: _entrance,
                                start: 0.38,
                                dy: 30,
                                child: const _StatCard(
                                  icon: Icons.monetization_on,
                                  iconColor: Color(0xFFE8A93C),
                                  value: 1240,
                                  label: 'Coins saved',
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: staggered(
                                parent: _entrance,
                                start: 0.44,
                                dy: 30,
                                child: const _StatCard(
                                  icon: Icons.workspace_premium,
                                  iconColor: AppColors.orange,
                                  value: 12,
                                  label: 'Badges earned',
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 26),
                        staggered(
                          parent: _entrance,
                          start: 0.5,
                          child: const _SettingsHeader(),
                        ),
                        const SizedBox(height: 14),
                        staggered(
                          parent: _entrance,
                          start: 0.56,
                          child: _SettingsCard(
                            notifOn: _notifOn,
                            onNotifChanged: (v) => setState(() => _notifOn = v),
                          ),
                        ),
                        const SizedBox(height: 18),
                        staggered(
                          parent: _entrance,
                          start: 0.68,
                          dy: 26,
                          child: _LogOutButton(loop: _loop),
                        ),
                      ],
                    ),
                  ),
                ),
                _BottomNavBar(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ================= BACKGROUND BLOBS =================
class _BlobPainter extends CustomPainter {
  final double t; // 0..1 looping
  _BlobPainter(this.t);

  @override
  void paint(Canvas canvas, Size size) {
    void blob(Offset base, double radius, Color color, double freq, double phase) {
      final dx = math.sin(t * 2 * math.pi * freq + phase) * 14;
      final dy = math.cos(t * 2 * math.pi * freq + phase) * 10;
      final paint = Paint()
        ..color = color.withValues(alpha: 0.55)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 40);
      canvas.drawCircle(base.translate(dx, dy), radius, paint);
    }

    blob(Offset(size.width * 0.15, size.height * 0.08), 90, AppColors.blobYellow, 1, 0);
    blob(Offset(size.width * 0.9, size.height * 0.05), 70, AppColors.blobPink, 0.7, 2);
    blob(Offset(size.width * 0.85, size.height * 0.6), 100, AppColors.blobMint, 0.9, 4);
    blob(Offset(size.width * 0.05, size.height * 0.75), 80, AppColors.blobYellow, 0.6, 1.5);
  }

  @override
  bool shouldRepaint(covariant _BlobPainter oldDelegate) => oldDelegate.t != t;
}

// ================= TOP BAR =================
class _TopBar extends StatelessWidget {
  final AnimationController loop;
  const _TopBar({required this.loop});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'My profile',
                  style: const TextStyle(color: AppColors.grayText, fontSize: 13),
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    const Text(
                      'Hi, Amani!',
                      style: const TextStyle(
                        color: AppColors.darkGreen,
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(width: 4),
                    AnimatedBuilder(
                      animation: loop,
                      builder: (context, _) {
                        final wave = math.sin(loop.value * 2 * math.pi * 3);
                        return Transform.rotate(
                          angle: wave * 0.35,
                          child: const Text('👋', style: TextStyle(fontSize: 20)),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        BouncyTap(
          onTap: () {},
          child: AnimatedBuilder(
            animation: loop,
            builder: (context, _) {
              final glow = 0.5 + 0.5 * math.sin(loop.value * 2 * math.pi);
              return Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.mintCircle,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.midGreen.withValues(alpha: 0.25 * glow),
                      blurRadius: 10,
                      spreadRadius: 1,
                    ),
                  ],
                ),
                child: const Icon(Icons.auto_awesome, color: AppColors.midGreen, size: 18),
              );
            },
          ),
        ),
      ],
    );
  }
}

// ================= ANIMATED AVATAR =================
class _AnimatedAvatar extends StatelessWidget {
  final AnimationController loop;
  const _AnimatedAvatar({required this.loop});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 140,
      height: 140,
      child: AnimatedBuilder(
        animation: loop,
        builder: (context, _) {
          final breathe = 1.0 + 0.03 * math.sin(loop.value * 2 * math.pi);
          return Stack(
            alignment: Alignment.center,
            clipBehavior: Clip.none,
            children: [
              // sonar pulse rings
              for (final phase in [0.0, 0.5])
                _PulseRing(t: (loop.value + phase) % 1.0),
              // sparkles orbiting
              ..._sparklePositions(loop.value),
              // main avatar
              Transform.scale(
                scale: breathe,
                child: BouncyTap(
                  onTap: () {},
                  child: SizedBox(
                    width: 96,
                    height: 96,
                    child: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        Container(
                          width: 96,
                          height: 96,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.avatarRing, width: 3),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.avatarRing.withValues(alpha: 0.4),
                                blurRadius: 14,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                          padding: const EdgeInsets.all(4),
                          child: Container(
                            decoration: const BoxDecoration(
                              color: AppColors.avatarBg,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(Icons.face, size: 46,
                                color: AppColors.darkGreen.withValues(alpha: 0.75)),
                          ),
                        ),
                        Positioned(
                          bottom: 2,
                          right: 2,
                          child: BouncyTap(
                            onTap: () {},
                            child: Container(
                              width: 26,
                              height: 26,
                              decoration: BoxDecoration(
                                color: AppColors.orange,
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 2),
                              ),
                              child: const Icon(Icons.edit, size: 12, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  List<Widget> _sparklePositions(double t) {
    final specs = [
      (angleOffset: 0.0, radius: 62.0, size: 12.0, phase: 0.0),
      (angleOffset: 2.1, radius: 66.0, size: 9.0, phase: 0.3),
      (angleOffset: 4.2, radius: 58.0, size: 10.0, phase: 0.6),
    ];
    return specs.map((s) {
      final angle = t * 2 * math.pi * 0.5 + s.angleOffset;
      final dx = math.cos(angle) * s.radius;
      final dy = math.sin(angle) * s.radius;
      final twinkle = 0.4 + 0.6 * (0.5 + 0.5 * math.sin((t + s.phase) * 2 * math.pi * 2));
      return Positioned(
        left: 70 + dx - s.size / 2,
        top: 70 + dy - s.size / 2,
        child: Opacity(
          opacity: twinkle.clamp(0.0, 1.0),
          child: Icon(Icons.star, size: s.size, color: AppColors.sparkleYellow),
        ),
      );
    }).toList();
  }
}

class _PulseRing extends StatelessWidget {
  final double t; // 0..1
  const _PulseRing({required this.t});

  @override
  Widget build(BuildContext context) {
    final size = 96 + t * 40;
    final opacity = (1 - t) * 0.5;
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: AppColors.avatarRing.withValues(alpha: opacity),
          width: 2,
        ),
      ),
    );
  }
}

// ================= NAME ROW =================
class _NameRow extends StatelessWidget {
  const _NameRow();

  @override
  Widget build(BuildContext context) {
    return const Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text(
          'Amani Wanjiku',
          style: const TextStyle(
            color: AppColors.darkGreen,
            fontSize: 17,
            fontWeight: FontWeight.w700,
          ),
        ),
        SizedBox(width: 5),
        const Icon(Icons.check_circle, size: 16, color: AppColors.midGreen),
      ],
    );
  }
}

// ================= STAT CARD (count-up) =================
class _StatCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final int value;
  final String label;

  const _StatCard({
    required this.icon,
    required this.iconColor,
    required this.value,
    required this.label,
  });

  String _fmt(int v) {
    final s = v.toString();
    final buf = StringBuffer();
    for (int i = 0; i < s.length; i++) {
      final posFromEnd = s.length - i;
      buf.write(s[i]);
      if (posFromEnd > 1 && posFromEnd % 3 == 1) buf.write(',');
    }
    return buf.toString();
  }

  @override
  Widget build(BuildContext context) {
    return BouncyTap(
      onTap: () {},
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
        decoration: BoxDecoration(
          color: AppColors.cardWhite,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            TweenAnimationBuilder<double>(
              tween: Tween(begin: 0.0, end: 1.0),
              duration: const Duration(milliseconds: 700),
              curve: Curves.elasticOut,
              builder: (context, v, child) => Transform.scale(scale: v, child: child),
              child: Icon(icon, color: iconColor, size: 18),
            ),
            const SizedBox(height: 6),
            TweenAnimationBuilder<double>(
              tween: Tween(begin: 0.0, end: value.toDouble()),
              duration: const Duration(milliseconds: 1100),
              curve: Curves.easeOutCubic,
              builder: (context, v, _) => Text(
                _fmt(v.round()),
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: AppColors.darkGreen,
                ),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 10.5, color: AppColors.grayText),
            ),
          ],
        ),
      ),
    );
  }
}

// ================= SETTINGS HEADER =================
class _SettingsHeader extends StatelessWidget {
  const _SettingsHeader();

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Settings',
              style: const TextStyle(
                color: AppColors.darkGreen,
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
            SizedBox(height: 2),
            const Text(
              'Make Letter Box feel just right',
              style: const TextStyle(color: AppColors.grayText, fontSize: 12.5),
            ),
          ],
        ),
        BouncyTap(
          onTap: () {},
          child: const Icon(Icons.tune, color: AppColors.grayText, size: 20),
        ),
      ],
    );
  }
}

// ================= SETTINGS CARD =================
class _SettingsCard extends StatelessWidget {
  final bool notifOn;
  final ValueChanged<bool> onNotifChanged;

  const _SettingsCard({required this.notifOn, required this.onNotifChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardWhite,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 14,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Column(
        children: [
          _SettingsTile(
            icon: Icons.manage_accounts_outlined,
            title: 'Edit Profile',
            subtitle: 'Update your name and avatar',
            trailing: _AnimatedChevron(),
          ),
          const _Divider(),
          _SettingsTile(
            icon: Icons.shield_outlined,
            title: 'Parental Controls',
            subtitle: 'Keep your learning journey safe',
            trailing: _AnimatedChevron(),
          ),
          const _Divider(),
          _SettingsTile(
            icon: Icons.notifications_outlined,
            title: 'Notifications',
            subtitle: 'Get friendly learning reminders',
            trailing: _BouncySwitch(value: notifOn, onChanged: onNotifChanged),
          ),
          const _Divider(),
          _SettingsTile(
            icon: Icons.language,
            title: 'Language',
            subtitle: 'Choose what feels easiest',
            trailing: BouncyTap(
              onTap: () {},
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.bg,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'English',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.darkGreen,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    SizedBox(width: 4),
                    const Icon(Icons.keyboard_arrow_down, size: 16, color: AppColors.darkGreen),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AnimatedChevron extends StatefulWidget {
  @override
  State<_AnimatedChevron> createState() => _AnimatedChevronState();
}

class _AnimatedChevronState extends State<_AnimatedChevron> {
  double _dx = 0;

  @override
  Widget build(BuildContext context) {
    return BouncyTap(
      onTap: () async {
        setState(() => _dx = 6);
        await Future.delayed(const Duration(milliseconds: 150));
        if (mounted) setState(() => _dx = 0);
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
        transform: Matrix4.translationValues(_dx, 0, 0),
        child: const Icon(Icons.chevron_right, color: AppColors.grayText),
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  const _Divider();

  @override
  Widget build(BuildContext context) {
    return const Divider(
      height: 1,
      thickness: 1,
      indent: 60,
      endIndent: 16,
      color: AppColors.bg,
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Widget trailing;

  const _SettingsTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Row(
        children: [
          BouncyTap(
            onTap: () {},
            child: Container(
              width: 36,
              height: 36,
              decoration: const BoxDecoration(
                color: AppColors.mintCircle,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 17, color: AppColors.midGreen),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.darkGreen,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 11.5, color: AppColors.grayText),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          trailing,
        ],
      ),
    );
  }
}

// ================= BOUNCY SWITCH =================
class _BouncySwitch extends StatelessWidget {
  final bool value;
  final ValueChanged<bool> onChanged;
  const _BouncySwitch({required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onChanged(!value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 260),
        curve: Curves.easeOut,
        width: 44,
        height: 26,
        padding: const EdgeInsets.all(3),
        decoration: BoxDecoration(
          color: value ? AppColors.toggleGreen : const Color(0xFFE1E6E3),
          borderRadius: BorderRadius.circular(20),
        ),
        child: AnimatedAlign(
          duration: const Duration(milliseconds: 320),
          curve: Curves.elasticOut,
          alignment: value ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            width: 20,
            height: 20,
            decoration: const BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(color: Colors.black26, blurRadius: 3, offset: Offset(0, 1)),
              ],
            ),
            child: value
                ? const Icon(Icons.check, size: 12, color: AppColors.toggleGreen)
                : null,
          ),
        ),
      ),
    );
  }
}

// ================= LOG OUT =================
class _LogOutButton extends StatelessWidget {
  final AnimationController loop;
  const _LogOutButton({required this.loop});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: loop,
      builder: (context, child) {
        final glow = 0.5 + 0.5 * math.sin(loop.value * 2 * math.pi * 0.5);
        return Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: AppColors.orange.withValues(alpha: 0.15 * glow),
                blurRadius: 16,
                spreadRadius: 1,
              ),
            ],
          ),
          child: child,
        );
      },
      child: BouncyTap(
        onTap: () {},
        child: SizedBox(
          width: double.infinity,
          child: TextButton(
            onPressed: () {},
            style: TextButton.styleFrom(
              backgroundColor: const Color(0xFFF3E4DE),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.logout, size: 16, color: AppColors.orange),
                SizedBox(width: 8),
                const Text(
                  'Log Out',
                  style: const TextStyle(
                    color: AppColors.orange,
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ================= BOTTOM NAV =================
class _BottomNavBar extends StatefulWidget {
  @override
  State<_BottomNavBar> createState() => _BottomNavBarState();
}

class _BottomNavBarState extends State<_BottomNavBar> {
  int _selected = 0;

  static const _items = [
    (icon: Icons.home_rounded, label: 'Home'),
    (icon: Icons.sports_esports_outlined, label: 'Games'),
    (icon: Icons.show_chart_rounded, label: 'Progress'),
    (icon: Icons.card_giftcard_outlined, label: 'Rewards'),
    (icon: Icons.emoji_events_outlined, label: 'Leaderboard'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFEFF3F0), width: 1)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: List.generate(_items.length, (i) {
          final item = _items[i];
          final active = i == _selected;
          return GestureDetector(
            onTap: () => setState(() => _selected = i),
            behavior: HitTestBehavior.opaque,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 260),
              curve: Curves.easeOut,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: active ? AppColors.mintCircle : Colors.transparent,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AnimatedScale(
                    scale: active ? 1.15 : 1.0,
                    duration: const Duration(milliseconds: 320),
                    curve: Curves.elasticOut,
                    child: Icon(
                      item.icon,
                      size: 20,
                      color: active ? AppColors.darkGreen : AppColors.navInactive,
                    ),
                  ),
                  const SizedBox(height: 3),
                  AnimatedDefaultTextStyle(
                    duration: const Duration(milliseconds: 220),
                    style: TextStyle(
                      fontSize: 9.5,
                      color: active ? AppColors.darkGreen : AppColors.navInactive,
                      fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                    ),
                    child: Text(item.label),
                  ),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }
}
