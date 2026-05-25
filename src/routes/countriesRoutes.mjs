import express from 'express';

import {
    renderDashboard,
    renderCreate,
    createCountry,
    renderEdit,
    updateCountry,
    deleteCountry
} from '../controllers/countriesControllers.mjs';

import { countryValidationRules } from '../validators/countriesValidator.mjs';

const router = express.Router();

/* =========================
   DASHBOARD
========================= */

router.get('/',
    renderDashboard
);

/* =========================
   CREATE
========================= */

router.get('/create',
    renderCreate
);

router.post('/',
    countryValidationRules,
    createCountry
);

/* =========================
   EDIT
========================= */

router.get('/edit/:id',
    renderEdit
);

router.put('/:id',
    countryValidationRules,
    updateCountry
);

/* =========================
   DELETE
========================= */

router.delete('/:id',
    deleteCountry
);

export default router;
