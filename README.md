[![Continuous Integration](https://github.com/kaiosilveira/remove-flag-argument-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/remove-flag-argument-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Remove Flag Argument

**Formerly: Replace Parameter with Explicity Methods**

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
function setDimension(name, value) {
  if (name === 'height') {
    this._height = value;
    return;
  }
  if (name === 'width') {
    this._width = value;
    return;
  }
}
```

</td>

<td>

```javascript
function setHeight(value) {
  this._height = value;
}

function setWidth(value) {
  this._width = value;
}
```

</td>
</tr>
</tbody>
</table>

Flag arguments are a classic way of allowing the calling code to customize the behavior of a function. Depending on how they are implemented, though, they can put a big overhead on the readers, specially in programming languages without named arguments. This refactoring helps with bringing back clarify by removing the flag.

## Working example

Our working example is a system that calculates the delivery date of for a shipment. Target dates may vary depending on whether it's a rush delivery or not. The code looks like the following:

```javascript
export function deliveryDate(anOrder, isRush) {
  if (isRush) {
    let deliveryTime;
    if (['MA', 'CT'].includes(anOrder.deliveryState)) deliveryTime = 1;
    else if (['NY', 'NH'].includes(anOrder.deliveryState)) deliveryTime = 2;
    else deliveryTime = 3;
    return anOrder.placedOn.plusDays(1 + deliveryTime);
  } else {
    let deliveryTime;
    if (['MA', 'CT', 'NY'].includes(anOrder.deliveryState)) deliveryTime = 2;
    else if (['ME', 'NH'].includes(anOrder.deliveryState)) deliveryTime = 3;
    else deliveryTime = 4;
    return anOrder.placedOn.plusDays(2 + deliveryTime);
  }
}
```

The fact that `isRush` is being used as a basis for the code to basically execute two sub-functions stands out. Our goal here is to get rid of this flag by providing clear functions for the calling code to decide which one to use.

### Test suite

The test suite is exhaustive, going through all possible states with special conditions, but also covering the case where the destination is none of the mentioned ones. A sneak peak of it can be seen below:

```javascript
describe('deliveryDate', () => {
  const orderPlacementDate = new ManagedDate();

  describe('for standard orders', () => {
    it('should return 4 days for an order to be delivered at MA', () => {
      const anOrder = { deliveryState: 'MA', placedOn: orderPlacementDate };
      expect(deliveryDate(anOrder, false)).toEqual(anOrder.placedOn.plusDays(4));
    });

    it('should return 6 days for an order to be delivered at any other state', () => {
      const anOrder = { deliveryState: 'CA', placedOn: orderPlacementDate };
      expect(deliveryDate(anOrder, false)).toEqual(anOrder.placedOn.plusDays(6));
    });
  });

  // much more code...
});
```

These tests build a solid foundation so we can safely proceed with the upcoming refactorings.

### Steps

We start by applying [decompose conditional](https://github.com/kaiosilveira/decompose-conditional-refactoring/) to `deliveryDate`. This step creates a specific function for each branch of the top-level `if` statement, rendering `deliveryDate` to a simple two-liner:

```diff
@@ -1,15 +1,20 @@
 export function deliveryDate(anOrder, isRush) {
+  if (isRush) return rushDeliveryDate(anOrder);
+  else return regularDeliveryDate(anOrder);
+}
+
+export function rushDeliveryDate(anOrder) {
+  let deliveryTime;
+  if (['MA', 'CT'].includes(anOrder.deliveryState)) deliveryTime = 1;
+  else if (['NY', 'NH'].includes(anOrder.deliveryState)) deliveryTime = 2;
+  else deliveryTime = 3;
+  return anOrder.placedOn.plusDays(1 + deliveryTime);
+}
+
+export function regularDeliveryDate(anOrder) {
+  let deliveryTime;
+  if (['MA', 'CT', 'NY'].includes(anOrder.deliveryState)) deliveryTime = 2;
+  else if (['ME', 'NH'].includes(anOrder.deliveryState)) deliveryTime = 3;
+  else deliveryTime = 4;
+  return anOrder.placedOn.plusDays(2 + deliveryTime);
 }
```

The, we update the first caller to use `rushDeliveryDate` instead of `deliveryDate`:

```diff
@@ -1,9 +1,9 @@
-import { deliveryDate } from './get-delivery-date/index.js';
+import { rushDeliveryDate } from './get-delivery-date/index.js';
 import { ManagedDate } from './managed-date/index.js';
 const anOrder = { deliveryState: 'MA', placedOn: new ManagedDate() };
 const aShipment = {};
-aShipment.deliveryDate = deliveryDate(anOrder, true);
+aShipment.deliveryDate = rushDeliveryDate(anOrder);
 console.log(`Order will be delivered on: ${aShipment.deliveryDate.toString()}`);
```

and, similarly, we update caller-2 to use `regularDeliveryDate`:

```diff
@@ -1,9 +1,9 @@
-import { deliveryDate } from './get-delivery-date/index.js';
+import { regularDeliveryDate } from './get-delivery-date/index.js';
 import { ManagedDate } from './managed-date/index.js';
 const anOrder = { deliveryState: 'MA', placedOn: new ManagedDate() };
 const aShipment = {};
-aShipment.deliveryDate = deliveryDate(anOrder, false);
+aShipment.deliveryDate = regularDeliveryDate(anOrder);
 console.log(`Order will be delivered on: ${aShipment.deliveryDate.toString()}`);
```

Now that all callers are updated, we can safely get rid of `deliveryDate` altogether:

```diff
@@ -1,8 +1,3 @@
-export function deliveryDate(anOrder, isRush) {
-  if (isRush) return rushDeliveryDate(anOrder);
-  else return regularDeliveryDate(anOrder);
-}
-
 export function rushDeliveryDate(anOrder) {
   let deliveryTime;
   if (['MA', 'CT'].includes(anOrder.deliveryState)) deliveryTime = 1;
```

And that's it!

### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                  | Message                                                                |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [7800e31](https://github.com/kaiosilveira/remove-flag-argument-refactoring/commit/7800e319b888da53975420fc10319888e3ea0456) | apply decompose conditional to `deliveryDate`                          |
| [fda0cf6](https://github.com/kaiosilveira/remove-flag-argument-refactoring/commit/fda0cf6a58a1abbe0c7c2ac1b03656a893629ab6) | update caller-1 to use `rushDeliveryDate` instead of `deliveryDate`    |
| [40ac413](https://github.com/kaiosilveira/remove-flag-argument-refactoring/commit/40ac413adbd13d0c920dc1188414462f03bba34e) | update caller-2 to use `regularDeliveryDate` instead of `deliveryDate` |
| [ce89f61](https://github.com/kaiosilveira/remove-flag-argument-refactoring/commit/ce89f61ab91afa49d9e1e4c346f9b7dd6e0b9abb) | delete `deliveryDate`                                                  |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/remove-flag-argument-refactoring/commits/main).
