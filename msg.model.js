
class SocketMsgModel {
  constructor({
    driverName,
    customerName,
    customerPhoneNumber,
    driverPhoneNumber,
    driverLicense,
    customerId,
    driverId,
    customerSocketId,
    driverSocketId,
    pickupPoint,
    destinationPoint,
    pickupAddress,
    destinationAddress,
    customerPosition,
    driverPosition,
    rideId,
    distance,
    customer,
    driver,
    price,
    paymentMethod,
    service
  }) {
    this.paymentMethod = paymentMethod;
    this.rideId = rideId;
    this.customerId = customerId;
    this.driverId = driverId;
    this.customerSocketId = customerSocketId;
    this.driverSocketId = driverSocketId;
    this.pickupPoint = pickupPoint;
    this.destinationPoint = destinationPoint;
    this.pickupAddress = pickupAddress;
    this.destinationAddress = destinationAddress;
    this.customerPosition = customerPosition;
    this.driverPosition = driverPosition;
    this.distance = distance;
    this.customer = customer;
    this.driver = driver;
    this.driverName = driverName;
    this.customerName = customerName;
    this.customerPhoneNumber = customerPhoneNumber;
    this.driverPhoneNumber = driverPhoneNumber;
    this.driverLicense = driverLicense;
    this.price = price;
    this.service = service;
  }
  static fromJson(json) {
    return new SocketMsgModel({
      customerId: json['customerId'] || '',
      driverId: json['driverId'] || '',
      customerSocketId: json['customerSocketId'] || '',
      driverSocketId: json['driverSocketId'] || '',
      pickupPoint: json['pickupPoint'] || null,
      destinationPoint: json['destinationPoint'] || null,
      pickupAddress: json['pickupAddress'] || '',
      destinationAddress: json['destinationAddress'] || '',
      customerPosition: json['customerPosition'] || null,
      driverPosition: json['driverPosition'] || null,
      rideId: json['rideId'] || '',
      distance: json['distance'] || '',
      customer: json['customer'] || {},
      driver: json['driver'] || {},
      driverName: json['driverName'] || '',
      customerName: json['customerName'] || '',
      customerPhoneNumber: json['customerPhoneNumber'] || '',
      driverPhoneNumber: json['driverPhoneNumber'] || '',
      driverLicense: json['driverLicense'] || '',
      price: json['price'] || '',
      paymentMethod: json['paymentMethod'] || '',
      service: json['service'] || ''
    });
  }
}

module.exports = SocketMsgModel;
