import { Folio } from "@db/models";

function addLeadingZeros(str, targetLength) {
  return str.padStart(targetLength, "0");
}

const folio = {
  foodDelivery: async () => {
    const { foodDelivery: nextFolio } = await Folio.findOneAndUpdate(
      {},
      { $inc: { foodDelivery: 1 } }
    );
    console.log();
    const formattedFolio = "FD" + addLeadingZeros(String(nextFolio), 12);
    return formattedFolio;
  },
};

export { folio };
