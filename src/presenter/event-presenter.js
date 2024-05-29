import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortingView from '../view/sorting-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import ListEmptyView from '../view/list-empty-view.js';
import { sortByDefault, sortByPrice, sortByTime } from '../utils/sort.js';
import { SortType } from '../const.js';

export default class EventPresenter {
  #eventContainer = null;
  #waypointsModel = null;
  #sortsComponent = null;

  #currentSortType = SortType.DEFAULT;

  #eventListComponent = new EventListView();

  #eventWaypoints = [];
  #destinations = [];
  #offers = [];

  #waypointPresenters = new Map();

  constructor({eventContainer, waypointsModel}) {
    this.#eventContainer = eventContainer;
    this.#waypointsModel = waypointsModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
  }

  get waypoints() {
    switch(this.#currentSortType) {
      case SortType.PRICE:
        return sortByPrice(this.#waypointsModel.waypoints);
      case SortType.TIME:
        return sortByTime(this.#waypointsModel.waypoints);
    }
    return sortByDefault(this.#waypointsModel.waypoints);
  }

  init() {
    this.#eventWaypoints = this.waypoints;
    this.#destinations = [...this.#waypointsModel.destinations];
    this.#offers = [...this.#waypointsModel.offers];

    this.#renderEventsBoard();
  }

  #renderWaypoint(waypoint, destination, offers) {
    const waypointPresenter = new WaypointPresenter(
      this.#eventListComponent.element,
      this.#handleViewAction,
      this.#handleModeChange,
    );
    waypointPresenter.init(waypoint, destination, offers);
    this.#waypointPresenters.set(waypoint.id, waypointPresenter);
  }

  #renderSorts() {
    this.#sortsComponent = new SortingView(this.#handleSortTypeChange);
    render(this.#sortsComponent, this.#eventContainer);
  }

  #renderWaypointsList() {
    render(this.#eventListComponent, this.#eventContainer);

    for (const waypoint of this.waypoints) {
      this.#renderWaypoint(waypoint, this.#destinations, this.#offers);
    }
  }

  #clearWaypointsList() {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
  }

  #renderEventsBoard() {
    if (!this.waypoints.length) {
      render(new ListEmptyView(), this.#eventContainer);
      return;
    }

    this.#renderSorts();
    this.#renderWaypointsList();
  }

  // #handleWaypointChange = (updatedWaypoint) => {
  //   this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint, this.#destinations, this.#offers);
  // };

  #handleViewAction = (actionType, updateType, update) => {
    console.log((actionType, updateType, update));
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
  };

  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.modeReset());
  };

  #handleSortTypeChange = (selectedSortType) => {
    if (this.#currentSortType === selectedSortType) {
      return;
    }
    this.#currentSortType = selectedSortType;

    this.#clearWaypointsList();
    this.#renderWaypointsList();
  };
}
