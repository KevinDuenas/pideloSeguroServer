import { User, Config, Trip } from "@db/models";
import resolveTrip from "@graphql/resolvers/trip";

const tripFields = {
  Trip: {
    routeUrl: async ({ destinations }, _, { user: { id }, loaders }) => {
      let url = "https://www.google.com/maps/dir/?api=1";
      url += "&waypoints=";
      url += destinations[0].formattedAddress;
      url += "&destination=";
      url += destinations[1].formattedAddress;
      return encodeURI(url);
    },
  },
};

export default tripFields;
