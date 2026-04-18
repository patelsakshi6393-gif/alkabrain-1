import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import meRouter from "./me.js";
import dashboardRouter from "./dashboard.js";
import campaignsRouter from "./campaigns.js";
import templatesRouter from "./templates.js";
import leadsRouter from "./leads.js";
import integrationsRouter from "./integrations.js";
import billingRouter from "./billing.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(meRouter);
router.use(dashboardRouter);
router.use(campaignsRouter);
router.use(templatesRouter);
router.use(leadsRouter);
router.use(integrationsRouter);
router.use(billingRouter);

export default router;
