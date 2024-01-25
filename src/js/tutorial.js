// chrome://flags/#enable-generic-sensor-extra-classes

class AmbientLightSensorMonitor {
  constructor(messageElementId, bulbElementId) {
    this.messageElement = document.getElementById(messageElementId);
    this.bulbElement = document.getElementById(bulbElementId);
    this.initSensor();
  }

  initSensor() {
    if ("AmbientLightSensor" in window) {
      this.messageElement.innerHTML = "supported";
      this.sensor = new AmbientLightSensor();

      this.sensor.onreading = () => this.handleReading();

      this.sensor.onerror = (event) => this.handleError(event);

      this.sensor.start();
    }

    //
    else {
      this.messageElement.innerHTML = "NOT Supported";
    }
  }

  handleReading() {
    const illuminance = this.sensor.illuminance;

    // Check if the ambient light is low.
    if (illuminance < 15) {
      // Move your hand closer to the laptop's
      // camera to emulate darkness.
      this.updateUI(`<b>Dark</b> ${illuminance} <em>lux</em>`, true);
    }

    // Check if the ambient light is high.
    else {
      // Move your hand away from the laptop's
      // camera to emulate increased light.
      this.updateUI(
        `<b>Light</b> ${illuminance} <em>lux</em>`,
        false
      );
    }

    // Update the bulb's visual brightness.
    this.updateBulb(illuminance);
  }

  handleError(event) {
    console.log(event.error);
  }

  updateUI(message, isDark) {
    this.messageElement.innerHTML = message;
    if (isDark) {
      document.body.classList.add("dark");
    }

    //
    else {
      document.body.classList.remove("dark");
    }
  }

  updateBulb(illuminance) {
    // Normalize the illuminance value for a wider range
    const normalizedIlluminance = Math.log10(illuminance + 1);

    const maxLogValue = Math.log10(1000);
    const opacity = Math.min(
      Math.max(normalizedIlluminance / maxLogValue, 0.1),
      1
    );

    this.bulbElement.style.opacity = opacity;
    this.bulbElement.style.boxShadow = `0 0 ${30 * opacity}px yellow`;
  }
}

// Usage
new AmbientLightSensorMonitor("msg", "bulb");
