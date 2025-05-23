import {Keyring} from "@polkadot/api";

export const getFormatAddress = (address: string, prefix: number = 42) => {
  const keyring = new Keyring();
  const account = keyring.addFromAddress(address);
  keyring.setSS58Format(prefix);
  return account.address;
}