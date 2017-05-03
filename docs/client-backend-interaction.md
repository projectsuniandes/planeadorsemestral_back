# planeadorsemestral_back

Cuando el cliente desde el front envía sus preferencias de optimizacion, el JSON tendrá el siguiente formato (es un ejemplo):
Vamos a tener un programa base, que será el primer programa del estudiante. Los otros programas serán los extra que el estudiante quiera agregar durante su vida en la universidad.
Para efectos simples, probaremos other-programs con un tamanio de 1, y luego probaremos agregar nuevos programas.
{
  firstProgram: 'ISIS',
  secondProgram: 'FISI',
  option: 'BIOL',
  coursesTaken: ['ISIS1001', 'MATE1002', 'DERE1300']
  minCredits: 17,
  maxCredits: 18
}
