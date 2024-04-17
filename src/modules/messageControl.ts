import { MessageOptions, ProgressLocation, window } from 'vscode';

interface ShowMessageParams extends MessageOptions {
    type?: 'info' | 'error';
    message: string;
}

interface ShowTimedMessageParams {
    message: string;
    duration?: number;
}

export class MessageControl {
    showMessage = ({ type = 'info', message, ...messageOptions }: ShowMessageParams) => {
        const handler = type === 'info' ? window.showInformationMessage : window.showErrorMessage;

        handler(message, messageOptions);
    };

    showTimedMessage = ({ message, duration = 2 }: ShowTimedMessageParams) => {
        window.withProgress({ location: ProgressLocation.Notification, cancellable: true }, async progress => {
            return new Promise(async resolve => {
                for (let i = 0; i <= duration; i++) {
                    progress.report({ increment: (100 / duration) * i, message });
                    await this.sleep(1000);
                }

                resolve(null);
            });
        });
    };

    sleep = (time: number) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };
}
