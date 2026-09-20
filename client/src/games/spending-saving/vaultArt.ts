import vaultKid from "@/assets/icons/vault/vault-kid.png";
import vaultTeen from "@/assets/icons/vault/vault-teen.png";
import vaultStudent from "@/assets/icons/vault/vault-student.png";
import vaultShop from "@/assets/icons/vault/vault-shop.png";
import vaultPhone from "@/assets/icons/vault/vault-phone.png";
import vaultLock from "@/assets/icons/vault/vault-lock.png";
import vaultPlane from "@/assets/icons/vault/vault-plane.png";
import vaultGlobe from "@/assets/icons/vault/vault-globe.png";
import vaultSiblings from "@/assets/icons/vault/vault-siblings.png";
import vaultLantern from "@/assets/icons/vault/vault-lantern.png";
import vaultWorker from "@/assets/icons/vault/vault-worker.png";
import vaultBank from "@/assets/icons/vault/vault-bank.png";
import vaultWoman from "@/assets/icons/vault/vault-woman.png";
import vaultDad from "@/assets/icons/vault/vault-dad.png";
import { avatars, icons, gameArt } from "@/assets/icons";
import mascot from "@/assets/mascot.png";

export const vaultArt = {
  kid: vaultKid,
  teen: vaultTeen,
  student: vaultStudent,
  shop: vaultShop,
  phone: vaultPhone,
  lock: vaultLock,
  plane: vaultPlane,
  globe: vaultGlobe,
  siblings: vaultSiblings,
  lantern: vaultLantern,
  worker: vaultWorker,
  bank: vaultBank,
  woman: vaultWoman,
  dad: vaultDad,
  piggy: icons.badgePiggy,
  coin: icons.coin,
  rocket: icons.badgeRocket,
  trophy: icons.trophy,
  crown: icons.shopCrown,
  sprout: gameArt["save-invest"],
  medal: icons.badgeMedal,
  fox: avatars.fox,
  panda: avatars.panda,
  mascot,
} as const;

export type VaultArtKey = keyof typeof vaultArt;
