module.exports = (plop) => {
  plop.setGenerator('skeleton', {
    description: 'Create a skeleton crud',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your skeleton name?'
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../src/models/{{pascalCase name}}.ts',
        templateFile: 'templates/model.hbs'
      },
      {
        type: 'add',
        path: '../src/domains/{{lowerCase name}}/{{dashCase name}}-repository.ts',
        templateFile: 'templates/repository.hbs'
      },
      {
        type: 'add',
        path: '../src/domains/{{lowerCase name}}/{{dashCase name}}-schema.ts',
        templateFile: 'templates/schema.hbs'
      },
      {
        type: 'add',
        path: '../src/app/api/{{lowerCase name}}/{{dashCase name}}-controller.ts',
        templateFile: 'templates/controller.hbs'
      },
      {
        type: 'add',
        path: '../src/app/api/{{lowerCase name}}/{{dashCase name}}-router.ts',
        templateFile: 'templates/router.hbs'
      }
    ]
  });
};
