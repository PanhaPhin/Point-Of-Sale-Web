export const getFiles = () => {
    const context = require.context('./', true, /.json$/);
    const modules = {};
    context.keys().forEach((key) => {
        const fileName = key.replace('./', '');
        const resource = require(`./${fileName}`);
        const namespace = fileName.replace('.json', '');
        modules[namespace] = JSON.parse(JSON.stringify(resource));
    });

    return modules
}
