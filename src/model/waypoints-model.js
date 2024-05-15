// import { createArray } from '../utils.js';
// import { WAYPOINTS_COUNT } from '../const.js';
import { mockWaypoints } from '../mock/waypoints.js';
import { mockDestinations } from '../mock/destination.js';
import { mockOffers } from '../mock/offers.js';

export default class WaypointsModel {
  // #waypoints = createArray(WAYPOINTS_COUNT, getRandomWaypoint);
  #waypoints = mockWaypoints;
  #destinations = mockDestinations;
  #offers = mockOffers;

  get waypoints() {
    return this.#waypoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
