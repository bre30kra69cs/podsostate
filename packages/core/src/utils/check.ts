type Prediction = [boolean, string?];

export const check = (...predictions: Prediction[]) => {
  predictions.forEach(([show, message]) => {
    if (show) {
      throw Error(message);
    }
  });
};
