import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class Message{
  constructor(public content: string, public sentBy: string,) {}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({accessToken: this.token});
  conversation = new BehaviorSubject<Message[]>([]); // default value as []
  imgUrls: string[] = [
    'https://qph.fs.quoracdn.net/main-qimg-1331730fa7e57497badfb0a6240d0c77.webp',
    'https://static0.srcdn.com/wordpress/wp-content/uploads/2019/08/big-bang-theory-meme-sheldons-spot.jpg?q=50&fit=crop&w=740&h=740',
    'https://preview.redd.it/qev9xsufs0g41.jpg?width=500&format=pjpg&auto=webp&s=3c3da5eb111bbb4b42a4245ee98578f32a96dfc7',
    'https://i.pinimg.com/originals/d6/31/19/d63119a8e54dc3dba91ecb252ff83ad9.jpg',
    'https://i.imgflip.com/2bohxz.jpg'
  ];
  imgIndex: number = 0;


  talk(){
    this.client.textRequest("Who are you")
    .then(res => console.log(res.result.fulfillment.speech));
  }

  constructor(private http: HttpClient) { }

  // to make updates to conversation array
  update(msg: Message){
    this.conversation.next([msg]);
  }

  // sending message and receiving response
  converse(msg: string){
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    var index: number = msg.indexOf("weather");
    if(index !== -1){
      if(msg.indexOf("Dubai") !== -1){
        return this.http.get('https://api.openweathermap.org/data/2.5/weather?q=Dubai&appid=7f714af31d506b2f242c9b8d919b63fb')
        .subscribe(res => {
          var temp: string = (res['main']['temp'] - 273.15).toFixed(0).toString();
          const botMessage = new Message(`It is ${temp}°C in Dubai.`, 'bot');
          this.update(botMessage);
        });
      }
      return this.http.get('https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=7f714af31d506b2f242c9b8d919b63fb')
      .subscribe(res => {
        var temp: string = (res['main']['temp'] - 273.15).toFixed(0).toString();
        const botMessage = new Message(`It is ${temp}°C outside.`, 'bot');
        this.update(botMessage);
      });
    }
    index = msg.indexOf("meme");
    if(index !== -1){
      const imgMessage = new Message(this.imgUrls[this.imgIndex],'bot');
      if(this.imgIndex <= 3){
        this.imgIndex +=1;
      }else{
        this.imgIndex = 0;
      }
      return this.update(imgMessage);
    }
    return this.client.textRequest(msg)
    .then(res => {
      const speech = res.result.fulfillment.speech;
      const botMessage = new Message(speech, 'bot');
      this.update(botMessage);
    })
  }
}
