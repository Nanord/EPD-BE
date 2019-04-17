export { default as test} from './methods/test'

export { default as recipientscharges } from './methods/reportEPD/RecipientsCharges';
export { default as providerscharges } from './methods/reportEPD/ProvidersCharges';
export { default as providersacceptedpayments } from './methods/reportEPD/ProvidersAcceptedPayments'

export { default as payingagents } from './methods/monitoring/PayingAgents';
export { default as receipts } from './methods/monitoring/Receipts';
export { default as registers } from './methods/monitoring/Registers';
export { default as unconfirmedreceipts } from './methods/monitoring/UnconfirmedReceipts';

export { default as providersels } from './methods/balanceELS/ProvidersELS';
export { default as servicesels } from './methods/balanceELS/ServicesELS';

export { default as papayments } from './methods/reportPayment/PAPayments';
export { default as providerspayments } from './methods/reportPayment/ProvidersPayments';
export { default as servicepayments } from './methods/reportPayment/ServicePayments'
export { default as receiptpayments } from './methods/reportPayment/ReceiptPayments'