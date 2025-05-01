const pickUpDateError = document.getElementById("pickUpDateError");
const DropOffDateError = document.getElementById("DropOffDateError");
  const pickUpDate = new Date().toISOString().split('T')[0];
  document.getElementById("pickUpDate").setAttribute("min", pickUpDate);

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

export function DateValidation(pickUpDate, pickUpTime,DropOffDate,dropOffTime) {
    let isValid=true
  const now = new Date();
  const pickUpDateTime = new Date(`${pickUpDate} ${pickUpTime}`);
  const dropOffDateTime = new Date(`${DropOffDate} ${dropOffTime}`);
  if (pickUpDateTime < now) {
        pickUpDateError.innerText=`You can't choose an old date`
        isValid=false
        return
  } else {
    pickUpDateError.innerText=``
  }
  if (dropOffDateTime<pickUpDateTime) {
    DropOffDateError.innerText=`Drop off Date must be after pick up date`
    isValid=false
    return
  }
  else
  {
    DropOffDateError.innerText=''
  }
  return isValid
}
