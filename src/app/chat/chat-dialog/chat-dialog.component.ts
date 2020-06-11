import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators'

@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit {
  messages: Observable<Message[]>;
  formValue: string;

  constructor(public chatServive: ChatService) { }

  ngOnInit(): void {
    // convert BehaviorSubject into an Observable array
    this.messages = this.chatServive.conversation.asObservable()
    .pipe(scan((acc, val) => acc.concat(val)));
  }

  sendMessage(){
    this.chatServive.converse(this.formValue);
    this.formValue = '';
  }

}
