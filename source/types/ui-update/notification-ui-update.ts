import { ChangeType, UiUpdateType } from '../../enums';
import { Change } from '../change';

export type NotificationUiUpdate = Change & {
  type:
    | ChangeType.answerOffer
    | ChangeType.buildHouse
    | ChangeType.buyProperty
    | ChangeType.clearMortgage
    | ChangeType.freeParking
    | ChangeType.getOutOfJail
    | ChangeType.mortgage
    | ChangeType.passGo
    | ChangeType.payRent
    | ChangeType.payTax
    | ChangeType.remainInJail
    | ChangeType.sellHouse;
  uiUpdateType: UiUpdateType.notification;
};
