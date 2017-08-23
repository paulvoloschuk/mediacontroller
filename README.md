# Readme

1. We can configure model on construct.
2. We use singeleton.
3. Expression _media.device.[custom device]_ or _media.orientation.[landscape/portrait]_. will return [bool]
4. Expression media.[device/orientation].current containing current state.
5. Model changes on screen resize and fires _CustomEvent_ into _callback_.

Demo: https://paulvoloschuk.github.io/mediacontroller/

# Release Notes

### 0.1.0
Base structure

### 0.2.3
Add orientation property

### 0.2.5
Adding callback

### 0.2.6
throwing _Custom Event_
