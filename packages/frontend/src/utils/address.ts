import { createHash } from "crypto";
import { isAddress, type Address } from "viem";

// TODO: is this something we want to have?
export function getAddressColor(address?: Address) {
    if (!address || !isAddress(address)) return;

    const normalizedAddress = address.toLowerCase().replace(/^0x/, "");
    const hash = createHash("sha1").update(normalizedAddress).digest("hex");

    return `#${hash.substring(0, 6)}`;
}
