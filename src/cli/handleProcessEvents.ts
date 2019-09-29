/* eslint-disable no-console */

export function handleProcessEvents(): void {
  process.on('unhandledRejection', (reason) => {
    if (reason) {
      if (reason instanceof Error && reason.stack) {
        console.log(`Unhandled rejection: ${reason.stack}`);
      } else {
        try {
          console.log(`Unhandled rejection: ${JSON.stringify(reason)}`);
        } catch (err) {
          console.log(`Unhandled rejection: ${reason}`);
        }
      }
    } else {
      console.log('Unhandled rejection with no reason');
    }
    process.exit(1);
  });
}
