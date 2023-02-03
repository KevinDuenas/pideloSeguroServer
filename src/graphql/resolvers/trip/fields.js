import { User, Config, Trip } from "@db/models";
import resolveTrip from "@graphql/resolvers/trip";
import { env } from "@config/environment";

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
    trackingUrl: async ({ id: tripId }, _, { user: { id }, loaders }) => {
      let url = "";
      if (env.development) {
        // Note that this is the usual port where React App is running
        // Actually. the backend does not have a way to know which port is used
        url = `http://localhost:3000/tracking/${tripId}`;
      } else if (env.staging) {
        url = `https://onerp.com.mx/tracking/${tripId}`;
      } else if (env.production) {
        url = `https://onerp.com.mx/tracking/${tripId}`;
      }
      return url;
    },
  },
};

export default tripFields;
