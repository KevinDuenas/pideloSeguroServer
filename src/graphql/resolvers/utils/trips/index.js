import axios from "axios";

const tripsHelper = {
  calculateCost: async (storeCoordinates, shippingCoordinates) => {
    const KILOMETERS_INCLUDED = 5;
    const MINIMUM_QUOTE = 40.0;
    const PRICE_PER_KILOMETER = 10.0;
    let extraKilometersQuote = 0.0;
    let meters = 0.0;

    if (!storeCoordinates || shippingCoordinates)
      throw new Error("Missing information to calculate cost.");

    let url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${storeCoordinates[0]},${storeCoordinates[1]}&destinations=${shippingCoordinates[0]},${shippingCoordinates[1]}&key=${googleMapsConfig.apiKey}`;
    await axios
      .post(url)
      .then((res) => {
        let data = res.data.rows;
        meters = data[0].elements[0].distance.value;
        const kilometers = Math.round(meters / 1000);
        if (kilometers > KILOMETERS_INCLUDED) {
          extraKilometersQuote =
            (Math.floor(kilometers) - KILOMETERS_INCLUDED) *
            PRICE_PER_KILOMETER;
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
    return { cost: MINIMUM_QUOTE + extraKilometersQuote, meters };
  },
};

export default tripsHelper;
