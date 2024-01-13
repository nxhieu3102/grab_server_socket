
class SocketMsgModel {
  constructor({
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
  }) {
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
    });
  }
}

module.exports = SocketMsgModel;
