import {AppMessage} from '../../model/message.model';

export const MESSAGES = {
  guestAdded: { type: 'success', text: 'Guest added successfully.' } as AppMessage,
  guestDeleted: { type: 'success', text: 'Guest deleted successfully.' } as AppMessage,
  allGuestsDeleted: { type: 'success', text: 'All guests deleted successfully.' } as AppMessage,

  deleteFailed: { type: 'error', text: 'Failed to delete guest.' } as AppMessage,
  fetchFailed: { type: 'error', text: 'Failed to load guests.' } as AppMessage,
  unknownError: { type: 'error', text: 'Something went wrong.' } as AppMessage,
};
