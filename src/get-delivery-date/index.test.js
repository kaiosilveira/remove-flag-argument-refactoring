import { regularDeliveryDate, rushDeliveryDate } from '.';
import { ManagedDate } from '../managed-date';

describe('regularDeliveryDate', () => {
  const orderPlacementDate = new ManagedDate();

  it('should return 4 days for an order to be delivered at MA', () => {
    const anOrder = { deliveryState: 'MA', placedOn: orderPlacementDate };
    expect(regularDeliveryDate(anOrder, false)).toEqual(anOrder.placedOn.plusDays(4));
  });

  it('should return 4 days for an order to be delivered at CT', () => {
    const anOrder = { deliveryState: 'CT', placedOn: orderPlacementDate };
    expect(regularDeliveryDate(anOrder, false)).toEqual(anOrder.placedOn.plusDays(4));
  });

  it('should return 4 days for an order to be delivered at NY', () => {
    const anOrder = { deliveryState: 'NY', placedOn: orderPlacementDate };
    expect(regularDeliveryDate(anOrder, false)).toEqual(anOrder.placedOn.plusDays(4));
  });

  it('should return 5 days for an order to be delivered at ME', () => {
    const anOrder = { deliveryState: 'ME', placedOn: orderPlacementDate };
    expect(regularDeliveryDate(anOrder, false)).toEqual(anOrder.placedOn.plusDays(5));
  });

  it('should return 5 days for an order to be delivered at NH', () => {
    const anOrder = { deliveryState: 'NH', placedOn: orderPlacementDate };
    expect(regularDeliveryDate(anOrder, false)).toEqual(anOrder.placedOn.plusDays(5));
  });

  it('should return 6 days for an order to be delivered at any other state', () => {
    const anOrder = { deliveryState: 'CA', placedOn: orderPlacementDate };
    expect(regularDeliveryDate(anOrder, false)).toEqual(anOrder.placedOn.plusDays(6));
  });
});

describe('rushDeliveryDate', () => {
  const orderPlacementDate = new ManagedDate();

  it('should return 2 days for an order to be delivered at MA', () => {
    const anOrder = { deliveryState: 'MA', placedOn: orderPlacementDate };
    expect(rushDeliveryDate(anOrder, true)).toEqual(orderPlacementDate.plusDays(2));
  });

  it('should return 2 days for an order to be delivered at CT', () => {
    const anOrder = { deliveryState: 'CT', placedOn: orderPlacementDate };
    expect(rushDeliveryDate(anOrder, true)).toEqual(orderPlacementDate.plusDays(2));
  });

  it('should return 3 days for an order to be delivered at NY', () => {
    const anOrder = { deliveryState: 'NY', placedOn: orderPlacementDate };
    expect(rushDeliveryDate(anOrder, true)).toEqual(orderPlacementDate.plusDays(3));
  });

  it('should return 3 days for an order to be delivered at NH', () => {
    const anOrder = { deliveryState: 'NH', placedOn: orderPlacementDate };
    expect(rushDeliveryDate(anOrder, true)).toEqual(orderPlacementDate.plusDays(3));
  });

  it('should return 4 days for an that is to be delivered in any other state', () => {
    const anOrder = { deliveryState: 'ME', placedOn: orderPlacementDate };
    expect(rushDeliveryDate(anOrder, true)).toEqual(orderPlacementDate.plusDays(4));
  });
});
