import { PhoneIcon } from "@heroicons/react/outline";
import { ChipIcon, SupportIcon } from "@heroicons/react/solid";
import {
  AiOutlineCloudServer,
  AiOutlineDatabase,
  AiOutlineShoppingCart,
  AiOutlineUserSwitch,
} from "react-icons/ai";
import { BsCurrencyBitcoin, BsNewspaper } from "react-icons/bs";
import {
  MdOutlineBusiness,
  MdOutlineDeveloperMode,
  MdSecurity,
} from "react-icons/md";
import { RiMessage3Line, RiTeamLine } from "react-icons/ri";
import { VscServerProcess } from "react-icons/vsc";

/* --- Server --- */
export const SERVER_BASE =
  "http://167.99.4.19:4000" || process.env.REACT_APP_SERVER_BASE_URL;
export const SERVER = SERVER_BASE + "/api/v1";

/* --- Requests --- */
export const REQ = {
  STATUS: SERVER_BASE,
  USER: {
    VERIFY: SERVER + "/auth/me",
    LOGIN: SERVER + "/login",
    REGISTER: SERVER + "/register",
    SUBSCRIBE: {
      PRODUCT: SERVER + "/user/refer/product",
    },
  },
  METER: {
    ADD: SERVER + "/getMeter",
    ADD_METER: SERVER + "/createMeter",
    EDIT_METER: SERVER + "/getMeterForUpdate",
    UPDATE_SINGLE_METER: SERVER + "/updateMeter",
    VIEW_METER: SERVER + "/viewMeter",
    ORDER_BY_DESC: SERVER + "/dataMeterDesc",
    ORDER_BY_ASC: SERVER + "/dataMeterAsc",
    ONE_DAY_PRE: SERVER + "/getMeterOnePrevious",
    ONE_DAY_NEXT: SERVER + "/getMeterOneNext",
    DELETE_METER: SERVER + "/deleteMeter",
  },
  DIP: {
    ADD: SERVER + "/getDip",
    EDIT_DIP: SERVER + "/getDipForUpdate",
    GET_LITRES_MM: SERVER + "/getSingleDip",
    ADD_DIP: SERVER + "/createDip",
    UPDATE_SINGLE_DIP: SERVER + "/updateDip",
    VIEW_DIP: SERVER + "/viewDip",
    ORDER_BY_DESC: SERVER + "/dataDipDesc",
    ORDER_BY_ASC: SERVER + "/dataDipAsc",
    ONE_DAY_PRE: SERVER + "/getDipOnePrevious",
    ONE_DAY_NEXT: SERVER + "/getDipOneNext",
    DELETE_DIP: SERVER + "/deleteDip",
  },
  PURCHASE: {
    GET_VOUCHER: SERVER + "/addPurchase",
    SAVE_DATA: SERVER + "/createPurchase",
    GET_DATA: SERVER + "/getPurchase",
    UPDATE_PURCHASE: SERVER + "/updatePurchase",
    DELETE_SINGLE_INVOICE: SERVER + "/deleteSingleInvoice",
    DELETE_INVOICE: SERVER + "/deletePurchase",
    GET_REPORT: SERVER + "/getPurchaseByDate",
  },
  LUBE: {
    GET_VOUCHER: SERVER + "/addSale",
    SAVE_DATA: SERVER + "/createSale",
    GET_DATA: SERVER + "/getSale",
    UPDATE_SALE: SERVER + "/updateSale",
    DELETE_SINGLE_SALE: SERVER + "/deleteSingleSale",
    DELETE_SALE_VOUCHER: SERVER + "/deleteSale",
    ORDER_BY_DESC: SERVER + "/dataSaleDesc",
    ORDER_BY_ASC: SERVER + "/dataSaleAsc",
    ONE_DAY_PRE: SERVER + "/getSaleOnePrevious",
    ONE_DAY_NEXT: SERVER + "/getSaleOneNext",
  },
  RECEIPTS: {
    GET_VOUCHER: SERVER + "/addReceipt",
    GET_TRANSACTION_ID: SERVER + "/getTransactionId",
    SAVE_DATA: SERVER + "/createReceipt",
    GET_DATA: SERVER + "/getReceipt",
    UPDATE_RECEIPTS: SERVER + "/updateReceipt",
    DELETE_SINGLE_RECEIPTS: SERVER + "/deleteSingleReceipt",
    DELETE_RECEIPTS: SERVER + "/deleteReceipt",
  },
  PAYMENT: {
    GET_VOUCHER: SERVER + "/addPayment",
    GET_TRANSACTION_ID: SERVER + "/getPaymentTransactionId",
    SAVE_DATA: SERVER + "/createPayment",
    GET_DATA: SERVER + "/getPayment",
    ORDER_BY_DESC: SERVER + "/dataPaymentDesc",
    ONE_DAY_PRE: SERVER + "/dataPaymentOnePre",
    ONE_DAY_NEXT: SERVER + "/dataPaymentOneNext",
    ORDER_BY_ASC: SERVER + "/dataPaymentAsc",
    UPDATE_PAYMENT: SERVER + "/updatePayment",
    DELETE_SINGLE_PAYMENT: SERVER + "/deleteSinglePayment",
    DELETE_PAYMENT: SERVER + "/deletePayment",
  },
  BANK: {
    GET_VOUCHER: SERVER + "/addReceipt",
    GET_TRANSACTION_ID: SERVER + "/getTransactionId",
    SAVE_DATA: SERVER + "/createTransaction",
    GET_DATA: SERVER + "/getTransaction",
    UPDATE_BANK: SERVER + "/updateTransaction",
    DELETE_SINGLE_RECEIPTS: SERVER + "/deleteSingleReceipt",
    DELETE_RECEIPTS: SERVER + "/deleteReceipt",
  },
  JV: {
    GET_VOUCHER: SERVER + "/addJv",
    SAVE_DATA: SERVER + "/createJournalTransaction",
    GET_DATA: SERVER + "/getJournalTransaction",
    UPDATE_JOURNAL: SERVER + "/updateJournalTransaction",
    DELETE_SINGLE_TRANSACTION: SERVER + "/deleteSingalTransaction",
    DELETE_VOUCHER: SERVER + "/deleteJournalTransaction",
    DELETE_ZERO_ENRTY: SERVER + "/deleteZeroEntry",
  },
  OPENING_BALENCE_STOCK: {
    GET_DATE: SERVER + "/getStartingDate",
    SAVE_DATA: SERVER + "/addOpeningBalence",
    GET_DATA: SERVER + "/getOpeningBalence",
    UPDATE_OPENING: SERVER + "/updateOpeningBalence",
    DELETE_SINGLE_BAL: SERVER + "/deleteSingleBalence",
    DELETE_WHOLE: SERVER + "/deleteOpeningBalence",
  },
  ITEM: {
    GET_ITEM: SERVER + "/getItem",
    GET_ITEM_RATE: SERVER + "/getItemRate",
    GET_ITEM_QUANTITY: SERVER + "/itemQuantity",
  },
  SEARCH: {
    ALL_ITEMS: SERVER + "/getAllItemForList",
    GET_ALL_PARTY: SERVER + "/getAllParty",
    GET_GENERAL_LEDGER: SERVER + "/getAllGeneralLedger",
    GET_BANK: SERVER + "/getAllBank",
  },
  TANK: {
    GET_BY_ID: SERVER + "/findTankByItem",
    GET_ALL_TANK: SERVER + "/getAllTank",
    GET_ALL_TANK_FOR_EDIT: SERVER + "/getAllTankForEdit",
    GET_TANK_ITEM: SERVER + "/getTankItem",
    ADD_TANK: SERVER + "/createTank",
    UPDATE_TANK: SERVER + "/updateTank",
    DELETE_TANK: SERVER + "/deleteTank",
  },
  NOZEL: {
    ADD_NOZEL: SERVER + "/createNozel",
    GET_ALL_NOZEL: SERVER + "/getAllNozel",
    UPDATE_NOZEL: SERVER + "/updateNozel",
    DELETE_NOZEL: SERVER + "/deleteNozel",
  },
  ALL_REPORTS: {
    GET_STOCK_BALENCE: SERVER + "/getStockBalance",
  },
  REFRENCES: {
    GET_STITE_NAME: SERVER + "/findRefrence",
  },
  CHART_OF_ACCOUNT: {
    GET_ALL_ACCOUNT: SERVER + "/getAllAccount",
    ADD_ACCOUNT: SERVER + "/createAccount",
    UPDATE_ACCOUNT: SERVER + "/updateAccount",
    DELETE_ACCOUNT: SERVER + "/deleteAccount",
  },
};

export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/,
};

/* --- Errors --- */
export const ERR = {
  REFRESH: "Something went wrong, refresh to try again",
};

/* --- Support Data --- */
export const SUPPORT_DATA = [
  {
    icon: SupportIcon,
    title: "Consulting",
    description:
      "We help you create a clear digital strategy that optimizes your journey to total success in your technology-driven business.",
  },
  {
    icon: PhoneIcon,
    title: "Implementation",
    description:
      "Our expertise spans all key technologies and business functions, enabling us to provide comprehensive business solutions.",
  },
  {
    icon: ChipIcon,
    title: "Managed Services",
    description:
      "Our globally managed service teams secure your digital investment with 24/7 monitoring, maintenance and end-to-end support.",
  },
  {
    icon: ChipIcon,
    title: "BA",
    description:
      "Our experienced team, trained by business analysts, quickly supports your employees with timely, high-quality results.",
  },
];

/* --- All in One Data --- */
export const ALL_IN_ONE_DATA = [
  {
    icon: BsCurrencyBitcoin,
    title: "Blockchain",
  },
  {
    icon: AiOutlineShoppingCart,
    title: "Digital Commerce",
  },
  {
    icon: MdOutlineBusiness,
    title: "Business Application",
  },
  {
    icon: AiOutlineDatabase,
    title: "Data Management & Analytics",
  },
  {
    icon: VscServerProcess,
    title: "Business Process Outsourcing",
  },
  {
    icon: AiOutlineCloudServer,
    title: "Cloud Services",
  },
  {
    icon: MdOutlineDeveloperMode,
    title: "Application Development",
  },
  // {
  //   icon: MdOutlineIntegrationInstructions,
  //   title: "Application Integration",
  // },
  {
    icon: RiTeamLine,
    title: "Cloud Team",
  },
  {
    icon: MdSecurity,
    title: "Security",
  },
  {
    icon: BsNewspaper,
    title: "IT Infrastructure",
  },
  {
    icon: RiMessage3Line,
    title: "Quality Assurance",
  },
  {
    icon: AiOutlineUserSwitch,
    title: "User Experience",
  },
  // {
  //   icon: BsCurrencyBitcoin,
  //   title: "Application Modernization",
  // },
];
