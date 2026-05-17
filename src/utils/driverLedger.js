export const getGrossAmount = (trip) => parseFloat(trip.priceToDriver || "0");

export const getCommissionAmount = (trip) => parseFloat(trip.commissionAmount || "0");

export const isCommissionTaken = (trip) =>
  trip.commission === "Tanken" || trip.commission === "10";

/** Net payable to driver: gross minus commission amount */
export const getNetAmount = (trip) => {
  const gross = getGrossAmount(trip);
  const commission = getCommissionAmount(trip);
  return gross - commission;
};

/** Ledger: trip settlements (paidToDriver) + cash payments (DriverPayment) */
export const calculateDriverLedger = (trips, cashPayments = []) => {
  const totalGross = trips.reduce((sum, v) => sum + getGrossAmount(v), 0);
  const commissionTaken = trips
    .filter((v) => isCommissionTaken(v) && getCommissionAmount(v) > 0)
    .reduce((sum, v) => sum + getCommissionAmount(v), 0);
  const commissionPending = trips
    .filter((v) => !isCommissionTaken(v) && getCommissionAmount(v) > 0)
    .reduce((sum, v) => sum + getCommissionAmount(v), 0);
  const totalOwed = trips.reduce((sum, v) => sum + getNetAmount(v), 0);
  const paidViaTrips = trips
    .filter((v) => v.paidToDriver === true)
    .reduce((sum, v) => sum + getNetAmount(v), 0);
  const paidViaCash = cashPayments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalPaid = paidViaTrips + paidViaCash;
  const remaining = totalOwed - totalPaid;

  const round = (n) => parseFloat(n.toFixed(2));

  return {
    totalGross: round(totalGross),
    commissionTaken: round(commissionTaken),
    commissionPending: round(commissionPending),
    totalOwed: round(totalOwed),
    paidViaTrips: round(paidViaTrips),
    paidViaCash: round(paidViaCash),
    totalPaid: round(totalPaid),
    remaining: round(remaining),
  };
};
