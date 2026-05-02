import { runLater } from '../src/easy/runLater';

jest.useFakeTimers(); // Mock setTimeout

test('should call the callback function after specified time', () => {
  const callback = jest.fn();  // Create a mock function

  runLater(callback, 2000);  // Run the function with a 2-second delay

  // At this point, the callback should not be called yet
  expect(callback).not.toBeCalled();

  // Fast-forward time by 2 seconds
  jest.advanceTimersByTime(2000);

  // Now the callback should have been called
  expect(callback).toBeCalled();
  expect(callback).toHaveBeenCalledTimes(1);
});

test('should not call the callback before the time has passed', () => {
  const callback = jest.fn();

  runLater(callback, 1000);  // Run the function with a 1-second delay

  // At this point, the callback should not have been called yet
  expect(callback).not.toBeCalled();

  // Fast-forward time by 500ms, still should not be called
  jest.advanceTimersByTime(500);
  expect(callback).not.toBeCalled();

  // Fast-forward remaining 500ms to make it 1 second
  jest.advanceTimersByTime(500);
  expect(callback).toBeCalled();
  expect(callback).toHaveBeenCalledTimes(1);
});
