import { Component, EventEmitter, Output } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import axios from 'axios';
import { Task } from 'src/app/models/Task';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @Output() taskCreated = new EventEmitter<void>();

  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  async openCreateTask() {
    const alert = await this.alertController.create({
      header: 'Criar Tarefa',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título'
        },
        {
          name: 'content',
          type: 'textarea',
          placeholder: 'Conteúdo'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Criar',
          handler: async (data) => {
            const newTask = new Task(0, data.title, data.content, false);
            try {
              await axios.post('http://localhost:8000/task', newTask);
              this.showToast('Tarefa criada com sucesso!');
              this.taskCreated.emit();  
            } catch (error) {
              this.showToast('Erro ao criar tarefa.');
              console.error('Erro ao criar tarefa', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
