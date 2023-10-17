import cities from "../uscities.json";
import { getDistance } from "../geo_helpers";
import { convertUsStateAbbrAndName } from "../geo_helpers";
export default async function handler(req, res) {
    const { lat, lng } = req.query;
    const loc1 = { latitude: lat, longitude: lng };

    let closestCity = null;
    for (let city of cities) {
        const loc2 = { latitude: city.latitude, longitude: city.longitude };
        if (
            loc1.latitude === loc2.latitude &&
            loc1.longitude === loc2.longitude
        ) {
            res.status(200).json(city);
            return;
        }

        const dist = getDistance(loc1, loc2);
        if (!closestCity || dist < closestCity.distance) {
            closestCity = {
                ...city,
                distance: dist,
                abbrev: convertUsStateAbbrAndName(city.state),
            };
        }
    }
    res.status(200).json(closestCity);
}
