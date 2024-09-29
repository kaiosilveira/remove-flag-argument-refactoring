import { rushDeliveryDate } from './get-delivery-date/index.js';
import { ManagedDate } from './managed-date/index.js';

const anOrder = { deliveryState: 'MA', placedOn: new ManagedDate() };

const aShipment = {};
aShipment.deliveryDate = rushDeliveryDate(anOrder);

console.log(`Order will be delivered on: ${aShipment.deliveryDate.toString()}`);
