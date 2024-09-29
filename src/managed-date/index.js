export class ManagedDate {
  constructor(date) {
    this._value = date ?? new Date();
  }

  plusDays(days) {
    const date = new Date(this._value);
    date.setDate(date.getDate() + days);
    return date;
  }
}
