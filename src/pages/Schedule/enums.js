export const scheduleStatus = Object.freeze([
  { id: 1, name: 'Pendente', color: 'orange' },
  { id: 2, name: 'Concluído', color: 'green' },
  { id: 3, name: 'Cancelado', color: 'gray' },
])
export const scheduleTypes = Object.freeze([
  { id: 1, name: 'Tarefa', icon: 'calendar-check-o' },
  { id: 2, name: 'Ordem de serviço', icon: 'wrench' },
  { id: 3, name: 'Compromisso', icon: 'check-square-o' },
  { id: 4, name: 'Atividade', icon: 'clipboard' },
])
export const scheduleTimeOptions = Object.freeze([
  { description: 'Sem lembrete', time: 0, timeType: 1, isAllDay: true },
  { description: '0 minutos antes', time: 0, timeType: 2 },
  { description: '5 minutos antes', time: 5, timeType: 2 },
  { description: '15 minutos antes', time: 15, timeType: 2 },
  { description: '30 minutos antes', time: 30, timeType: 2 },
  { description: '1 hora antes', time: 1, timeType: 3 },
  { description: '2 horas antes', time: 2, timeType: 3 },
  { description: '12 horas antes', time: 12, timeType: 3 },
  { description: '1 dia antes', time: 1, timeType: 4, isAllDay: true },
  { description: '2 dias antes', time: 2, timeType: 4, isAllDay: true },
  { description: '1 semana antes', time: 7, timeType: 4, isAllDay: true },
  { description: 'Personalizado', time: 0, timeType: 0, isAllDay: true },
])
export const timeTypes = Object.freeze([
  { id: 1, name: 'Sem lembrete', value: 'None' },
  { id: 2, name: 'minutos', value: 'Minutes' },
  { id: 3, name: 'horas', value: 'Hours' },
  { id: 4, name: 'dias', value: 'Days', isAllDay: true },
])
