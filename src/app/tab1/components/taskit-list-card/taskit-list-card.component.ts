import { Component, OnInit, Input } from '@angular/core';
import axios from 'axios';
import { Task } from 'src/app/models/Task';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-taskit-list-card',
  templateUrl: './taskit-list-card.component.html',
  styleUrls: ['./taskit-list-card.component.scss'],
})
export class TaskitListCardComponent implements OnInit {

  @Input() isCompletedList: boolean = false;
  tasks: Task[] = [];

  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.getTasks();
  }

  async getTasks() {
    try {
      const response = await axios.get('http://localhost:8000/task');
      this.tasks = response.data.map((taskData: any) => {
        return new Task(
          taskData.id,
          taskData.title,
          taskData.content,
          taskData.isCompleted
        );
      });

      this.filterTasks();
      console.log(this.tasks);
    } catch (error) {
      console.error('Erro ao buscar as tarefas', error);
    }
  }

  filterTasks() {
    if (this.isCompletedList) {
      this.tasks = this.tasks.filter(task => task.isCompleted);
    } else {
      this.tasks = this.tasks.filter(task => !task.isCompleted);
    }
  }

  async toggleTaskCompletion(task: Task) {
    try {
      const updatedTask = { ...task, isCompleted: !task.isCompleted };
      await axios.put(`http://localhost:8000/task/${task.id}`, updatedTask);
      await this.getTasks();
      this.showToast('Tarefa atualizada com sucesso!');
    } catch (error) {
      this.showToast('Erro ao atualizar a tarefa.');
      console.error('Erro ao atualizar a tarefa', error);
    }
  }

  async confirmDeleteTask(task: Task) {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Você tem certeza que deseja excluir esta tarefa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Exclusão cancelada');
          }
        }, {
          text: 'Excluir',
          handler: async () => {
            await this.deleteTask(task);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteTask(task: Task) {
    try {
      await axios.delete(`http://localhost:8000/task/${task.id}`);
      await this.getTasks();
      console.log(`Tarefa ${task.title} excluída`);
    } catch (error) {
      console.error('Erro ao excluir a tarefa', error);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async editTask(task: Task) {
    const alert = await this.alertController.create({
      header: 'Editar Tarefa',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título',
          value: task.title
        },
        {
          name: 'content',
          type: 'textarea',
          placeholder: 'Conteúdo',
          value: task.content
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Salvar',
          handler: async (data) => {
            const updatedTask = { ...task, title: data.title, content: data.content };
            try {
              await axios.put(`http://localhost:8000/task/${task.id}`, updatedTask);
              await this.getTasks();
              this.showToast('Tarefa atualizada com sucesso!');
            } catch (error) {
              this.showToast('Erro ao atualizar a tarefa.');
              console.error('Erro ao atualizar a tarefa', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
