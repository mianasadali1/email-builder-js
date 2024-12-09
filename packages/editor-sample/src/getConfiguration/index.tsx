import { TEditorConfiguration } from '../documents/editor/core';

// Define the empty email message as a fallback configuration
const EMPTY_EMAIL_MESSAGE: TEditorConfiguration = {
  root: {
    type: 'EmailLayout',
    data: {
      backdropColor: '#F5F5F5',
      canvasColor: '#FFFFFF',
      textColor: '#262626',
      fontFamily: 'MODERN_SANS',
      childrenIds: [],
    },
  },
};

export default function getConfiguration(template: string) {
  

  return EMPTY_EMAIL_MESSAGE;
}
