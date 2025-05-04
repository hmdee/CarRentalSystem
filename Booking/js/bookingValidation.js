const pickUpDateError = document.getElementById("pickUpDateError");
const DropOffDateError = document.getElementById("DropOffDateError");

// user cant choose old date
const pickUpDate = new Date().toISOString().split("T")[0];
document.getElementById("pickUpDate").setAttribute("min", pickUpDate);
const DropOffDate = new Date().toISOString().split("T")[0];
document.getElementById("DropOffDate").setAttribute("min", DropOffDate);

export default function validateAllInputs(
  pickUpDate,
  DropOffDate,
  pickUpTime,
  dropOffTime
) {
  if (pickUpDate && DropOffDate && pickUpTime && dropOffTime) {
    return true;
  } else {
    return false;
  }
}

export function DateValidation(
  pickUpDate,
  pickUpTime,
  DropOffDate,
  dropOffTime
) {
  let isValid = true;
  const now = new Date();
  const pickUpDateTime = new Date(`${pickUpDate} ${pickUpTime}`);
  const dropOffDateTime = new Date(`${DropOffDate} ${dropOffTime}`);

  if (dropOffDateTime < pickUpDateTime) {
    DropOffDateError.innerText = `Drop off Date must be after pick up date`;
    isValid = false;
    return;
  } else {
    DropOffDateError.innerText = "";
  }
  return isValid;
}
