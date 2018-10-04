import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'lodash';

import { fetchTrainingModule } from '../../actions/training_action.js';


const TrainingModuleHandler = createReactClass({
  displayName: 'TrainingModuleHandler',

  getInitialState() {
    return { training_module: this.props.training.module };
  },

  componentWillMount() {
    const moduleId = document.getElementById('react_root').getAttribute('data-module-id');
    return this.props.fetchTrainingModule({ module_id: moduleId });
  },

  storeDidChange() {
    return this.setState(getState());
  },

  render() {
    const locale = I18n.locale;
    const slidesAry = _.compact(this.state.training_module.slides);
    const slides = slidesAry.map((slide, i) => {
      const disabled = !slide.enabled;
      const slideLink = `${this.state.training_module.slug}/${slide.slug}`;
      let liClassName;
      if (disabled) { liClassName = 'disabled'; }
      let summary;
      if (slide.summary) {
        summary = <div className="ui-text small sidebar-text">{slide.summary}</div>;
      }
      let slideTitle = slide.title;
      if (slide.translations && slide.translations[locale]) {
        slideTitle = slide.translations[locale].title;
      }
      return (
        <li className={liClassName} key={i}>
          <a disabled={disabled} href={slideLink}>
            <h3 className="h5">{slideTitle}</h3>
            {summary}
          </a>
        </li>
      );
    }
    );
    let moduleSource;
    if (this.state.training_module.wiki_page) {
      moduleSource = (
        <div className="training-module-source">
          <a href={`https://meta.wikimedia.org/wiki/${this.state.training_module.wiki_page}`} target="_blank">{I18n.t('training.view_module_source')}</a>
          <br />
          <a href={`/reload_trainings?module=${this.state.training_module.slug}`}>{I18n.t('training.reload_from_source')}</a>
        </div>
      );
    }

    return (
      <div className="training__toc-container">
        <h1 className="h4 capitalize"> {I18n.t('training.table_of_contents')} <span className="pull-right total-slides">({slidesAry.length})</span></h1>
        <ol>
          {slides}
        </ol>
        {moduleSource}
      </div>

    );
  }
});

const mapStateToProps = state => ({
  training: state.training
});

const mapDispatchToProps = {
  fetchTrainingModule
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainingModuleHandler);
