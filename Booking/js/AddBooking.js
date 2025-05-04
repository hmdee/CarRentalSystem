const user = JSON.parse(localStorage.getItem("currentUser"));
const selectedCar = JSON.parse(localStorage.getItem("selectedCar"));

export default function addBooking(
  pickupDate,
  dropOffDate,
  pickUpTime,
  dropOffTime
) {
  const { totalDays, extraHours, totalPrice } = calcTotalPrice(
    pickupDate,
    dropOffDate,
    pickUpTime,
    dropOffTime
  );
  const booking = {
    id: Date.now(),
    userId: user.id,
    carId: selectedCar.id,
    pickupDate: pickupDate,
    dropOffDate,
    pickUpTime,
    dropOffTime,
    status: "pending",
    totalPrice,
    createdAt: new Date().toISOString(),
  };
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  return { totalPrice, totalDays, extraHours };
}

export function calcTotalPrice(
  pickupDate,
  dropOffDate,
  pickUpTime,
  dropOffTime
) {
  const start = new Date(`${pickupDate} ${pickUpTime}`);
  const end = new Date(`${dropOffDate} ${dropOffTime}`);
  const diffMS = end - start;
  const diffHours = diffMS / (1000 * 60 * 60);
  const totalDays = Math.floor(diffHours / 24);
  const extraHours = (diffHours % 24).toFixed(2);
  const totalDaysPrice = totalDays * selectedCar.price_per_day;
  const pricePerHour = selectedCar.price_per_day / 24;
  const extraHoursPrice = pricePerHour * extraHours;
  const totalPrice = totalDaysPrice + extraHoursPrice;
  return { totalPrice, totalDays, extraHours };
}
