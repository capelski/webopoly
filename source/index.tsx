import React from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import { App } from './components/app';

const container = document.getElementById('app-placeholder')!;
const root = createRoot(container);
Modal.setAppElement(container);

root.render(<App />);
