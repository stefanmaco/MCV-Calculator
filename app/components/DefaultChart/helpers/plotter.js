import HRNumbers from 'human-readable-numbers';
/**
 * draws a plot for the received coordinates
 */
export default class FunctionPlotter {
  /**
   * gets the plot data
   * @param configs {Object} data: {Array} of {x,y} objects, container: {String} canvas id, textContainer: {String} container id to show the result when hovering over plot
   */
  constructor(configs) {
    this.data = configs.data;
    this.canvas = document.getElementById(configs.container);
    this.textContainer = document.getElementById(configs.textContainer);
    this.ctx = null;
    if (null != this.canvas && this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
    }
    this.scales = { minX: -1, maxX: 1, minY: -1, maxY: 1, xLen: 1, yLen: 1, pixelScaleX: 1, pixelScaleY: 1 };
  }

  /**
   * draws the XY axis on canvas
   */
  drawAxis = () => {
    let w = this.ctx.canvas.width;
    let h = this.ctx.canvas.height;
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgb(200,200,200)';
    this.ctx.moveTo(w / 2, 0);
    this.ctx.lineTo(w / 2, h);
    this.ctx.moveTo(0, h / 2);
    this.ctx.lineTo(w, h / 2);
    this.ctx.stroke();
  };
  /**
   * clears the canvas and redraws the XY axis
   */
  resetCanvas = () => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawAxis();
  };
  /**
   * calculates the min/max values in order to keep the plot centered on middle and set the pixel ratio for both horizontal and vertical
   */
  calculateScales = () => {
    let w = this.ctx.canvas.width;
    let h = this.ctx.canvas.height;
    this.data.forEach(item => {
      if (this.scales.minX > item.x) {
        this.scales.minX = item.x;
      }
      if (this.scales.minY > item.y) {
        this.scales.minY = item.y;
      }
      if (this.scales.maxX < item.x) {
        this.scales.maxX = item.x;
      }
      if (this.scales.maxY < item.y) {
        this.scales.maxY = item.y;
      }
    });
    this.scales.xLen = this.scales.maxX;
    if (this.scales.minX < 0) {
      if (this.scales.minX * -1 > this.scales.maxX) {
        this.scales.xLen = this.scales.minX * -1;
      }
    }
    this.scales.yLen = this.scales.maxY;
    if (this.scales.minY < 0) {
      if (this.scales.minY * -1 > this.scales.maxY) {
        this.scales.yLen = this.scales.minY * -1;
      }
    }
    this.scales.pixelScaleX = w / (this.scales.xLen * 2);
    this.scales.pixelScaleY = h / (this.scales.yLen * 2);
  };
  /**
   * transforms from cartesian to canvas coords system for X
   * @param x
   * @return {number}
   */
  computeXCoord = x => {
    return x * this.scales.pixelScaleX + this.ctx.canvas.width / 2;
  };
  /**
   * transforms from canvas to cartesian coords system for X
   * @param x
   * @return {number}
   */
  revertXCoord = canvasX => {
    return (canvasX - this.ctx.canvas.width / 2) / this.scales.pixelScaleX;
  };
  /**
   * transforms from cartesian to canvas coords system for Y
   * @param x
   * @return {number}
   */
  computeYCoord = y => {
    return y * -1 * this.scales.pixelScaleY + this.ctx.canvas.height / 2;
  };
  /**
   * draws each point of function
   */
  drawFn = () => {
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#1890ff';

    let initiated = false;
    this.data.forEach(item => {
      if (!isNaN(item.x) && !isNaN(item.y)) {
        let x = this.computeXCoord(item.x);
        let y = this.computeYCoord(item.y);
        if (!initiated) {
          this.ctx.moveTo(x, y);
          initiated = true;
          return;
        }
        this.ctx.lineTo(x, y);
      }
    });
    this.ctx.stroke();
  };
  /**
   * finds the closest value to X in the received data object
   * @param x
   * @return {*}
   */
  findClosestValue = x => {
    return this.data.reduce(function(prev, curr) {
      return Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev;
    });
  };
  /**
   * draws the point closer to cursor based on X coords and show the result in a container
   * @param item
   */
  drawPoint = item => {
    this.resetCanvas();
    this.drawFn();
    let x = this.computeXCoord(item.x);
    let y = this.computeYCoord(item.y);
    this.ctx.beginPath();
    this.ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = '#f5222d';
    this.ctx.fill();
    this.ctx.lineWidth = 0;
    this.ctx.strokeStyle = '#f5222d';
    this.ctx.stroke();
    if (this.textContainer) {
      this.textContainer.innerHTML = 'For x = <b>' + item.x.toFixed(2) + '</b>, the result is <b>' + HRNumbers.toHumanString(item.y) + "</b>. <br>Exact value: <i>" + item.y + '</i>.';
    }
  };
  /**
   * trigger to watch the mouse coordinates inside canvas
   */
  mouseTrigger = () => {
    this.canvas.addEventListener('mousemove', evt => {
      let mousePos = this.canvas.getBoundingClientRect();
      let x = evt.clientX - mousePos.left;
      let cartesianX = this.revertXCoord(x);
      let closestItem = this.findClosestValue(cartesianX);
      this.drawPoint(closestItem);
    });
  };
  /**
   * default function to be called in order to draw the plot
   */
  draw = () => {
    this.resetCanvas();
    this.calculateScales();
    this.drawFn();
    this.mouseTrigger();
  };
}
