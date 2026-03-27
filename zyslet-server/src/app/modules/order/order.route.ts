import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = express.Router();

// Create order (public route)
router.post(
   '/create',
   validateRequest(OrderValidation.createOrderZodSchema),
   OrderController.createOrder
);

// Get all orders (protected, admin only)
router.get(
   '/list',
   //  auth(USER_ROLE.ADMIN),
   OrderController.getAllOrders
);

// Get order by ID (protected)
router.get(
   '/:id',
   //  auth(USER_ROLE.ADMIN),
   OrderController.getOrderById
);

// Update order status (protected, admin only)
router.patch(
   '/status/:id',
   // auth(USER_ROLE.ADMIN),
   validateRequest(OrderValidation.updateOrderStatusZodSchema),
   OrderController.updateOrderStatus
);

// Delete order (protected, admin only)
router.delete(
   '/:id',
   //  auth(USER_ROLE.ADMIN),
   OrderController.deleteOrder
);

// Cancel order (protected, admin only)
router.patch(
   '/cancel/:id',
   // auth(USER_ROLE.ADMIN),
   OrderController.cancelOrder
);

// Approve order (protected, admin only)
router.patch(
   '/approve/:id',
   // auth(USER_ROLE.ADMIN),
   OrderController.approveOrder
);

// Complete order (protected, admin only)
router.patch(
   '/complete/:id',
   // auth(USER_ROLE.ADMIN),
   OrderController.completeOrder
);

export const OrderRoutes = router;
