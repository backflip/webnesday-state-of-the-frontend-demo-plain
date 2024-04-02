export type Pizza = {
  id: BigInteger;
  name: string;
};

export type Topping = {
  id: BigInteger;
  name: string;
};

export type PizzaAndTopping = {
  id: BigInteger;
  name: string;
  pizza_id: Pizza["id"];
  topping_id: Topping["id"];
};
