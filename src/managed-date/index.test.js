import { ManagedDate } from '.';

describe('ManagedDate', () => {
  describe('plusDays', () => {
    it('should return a date in the future', () => {
      const date = new ManagedDate(new Date(2021, 0, 1));
      expect(date.plusDays(1)).toEqual(new Date(2021, 0, 2));
    });
  });
});
