import Timer from '../src/Timer';

jest.useFakeTimers();

test('if can the timer be started and stopped.', () => {
    const instance = new Timer(500);

    expect(instance.interval === 500).toBe(true);
    expect(instance.isStopped).toBe(true);

    instance.start();

    expect(instance.isRunning).toBe(true);
    expect(instance.isStopped).toBe(false);

    let called = false;

    instance.stop(() => called = true);

    jest.runAllTimers();

    expect(instance.isStopped).toBe(true);

    expect(called).toBe(true);
    
});
