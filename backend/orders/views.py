from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderStatusUpdateSerializer

class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'owner':
            return Order.objects.all()
        return Order.objects.filter(user=user)

class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'order_id'

class OrderStatusUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderStatusUpdateSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'order_id'


class ReorderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        try:
            original_order = Order.objects.get(order_id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Create new order with same items
        import uuid
        new_order_id = str(uuid.uuid4())[:8].upper()
        
        new_order = Order.objects.create(
            order_id=new_order_id,
            user=request.user,
            order_total=original_order.order_total,
            payment_method=original_order.payment_method
        )
        
        # Copy order items
        for item in original_order.items.all():
            OrderItem.objects.create(
                order=new_order,
                product=item.product,
                quantity=item.quantity,
                price=item.price
            )
        
        serializer = OrderSerializer(new_order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
