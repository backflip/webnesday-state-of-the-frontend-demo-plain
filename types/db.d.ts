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
  pizza: Pizza;
  topping: Toppin;
};
