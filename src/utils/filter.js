import dayjs from 'dayjs';
import { FilterType } from '../const';

const currentDate = new Date();
// console.log(currentDate);

const filter = {
  [FilterType.EVERTHING]: (waypoints) => waypoints,
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => dayjs(waypoint.dateFrom).diff(dayjs(currentDate)) > 0),
  [FilterType.PRESENT]: (waypoints) => waypoints.filter((waypoint) => dayjs(waypoint.dateFrom).diff(dayjs(currentDate)) <= 0 && dayjs(waypoint.dateTo).diff(dayjs(currentDate)) >= 0),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => dayjs(waypoint.dateTo).diff(dayjs(currentDate)) < 0),
};

export { filter };