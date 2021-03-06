import * as React from 'react';
import { useMemo, useState } from 'react';
import { View } from 'remax/one';
import classNames from 'classnames';
import { getPrefixCls } from '../common';

const prefixCls = getPrefixCls('tabs');

export interface TabTitleProps {
  key?: string | number;
  tab?: React.ReactNode;
}

export interface TabProps {
  type?: string;
  direction?: string;
  activeKey?: string | number;
  fixed?: boolean;
  onTabClick?: (i: any) => void;
  headerContent?: React.ReactNode;
  children?: React.ReactNode;
  headerStyle?: React.CSSProperties;
  extra?: React.ReactNode;
  titleWidth?: number;
  titleSquare?: boolean;
  titleAlign?: string;
}

export interface TabContentProps {
  key?: string | number;
  tab?: React.ReactNode;
  active?: boolean;
  children?: React.ReactNode;
}

const heightUnit = 48;

const getTabContents = (children: React.ReactNode, activeKey?: string | number) => {
  const tabContents: any[] = [];
  const tabs: any[] = [];
  React.Children.forEach(children, (node: any, index: number) => {
    const newNode = node;
    if (React.isValidElement(node)) {
      return (
        tabs.push({ key: newNode.key, tab: newNode.props.tab }) &&
        tabContents.push(
          <TabContent
            key={newNode.key}
            {...newNode.props}
            active={
              activeKey === undefined
                ? index === 0 && newNode.key
                : String(activeKey) === newNode.key
            }
          />,
        )
      );
    }
  });
  return [tabs, tabContents];
};

const Tabs = (props: TabProps): React.ReactElement => {
  const {
    type,
    direction = 'horizontal',
    activeKey,
    fixed,
    onTabClick,
    headerContent,
    children,
    headerStyle,
    extra,
    titleWidth,
    titleSquare,
    titleAlign,
  } = props;

  const [selected, setSelected] = useState(0);

  const [tabs, tabContents] = getTabContents(children, activeKey);

  const getTabIndex = () => {
    let tIndex = 0;
    tabs.forEach((i: any, index: number) => {
      if (i.key === activeKey) {
        tIndex = index;
      }
    });
    return tIndex;
  };

  const curIndex = useMemo(() => getTabIndex(), [activeKey, tabs]);
  const fixedStyle = useMemo(() => {
    return fixed
      ? ({
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9,
        } as React.CSSProperties)
      : null;
  }, [fixed]);

  const handleTabClick = (item: any, index?: number) => {
    setSelected(index || 0);
    onTabClick?.(item);
  };

  const activeKeyStr = String(activeKey);

  if (direction === 'vertical') {
    return (
      <View className={prefixCls}>
        <View className={`${prefixCls}-vertical`}>
          <View className={`${prefixCls}-vertical-sidebar`}>
            {tabs?.map((item: TabTitleProps, index: number) => (
              <View
                key={item.key}
                className={`${prefixCls}-vertical-sidebar-item`}
                style={{
                  fontWeight: selected === index ? 500 : 400,
                  backgroundColor: selected === index ? '#FDFFFD' : '#FAFAFA',
                }}
                onTap={() => {
                  handleTabClick(item, index);
                }}
              >
                {item.tab}
                {selected === index && (
                  <View className={`${prefixCls}-vertical-sidebar-top`}>
                    <View className={`${prefixCls}-vertical-sidebar-top-circle`} />
                  </View>
                )}
                {selected === index && (
                  <View className={`${prefixCls}-vertical-sidebar-bottom`}>
                    <View className={`${prefixCls}-vertical-sidebar-bottom-circle`} />
                  </View>
                )}
              </View>
            ))}
            <View
              className={`${prefixCls}-vertical-sidebar-active`}
              style={{
                transform: `translate3d(0, ${selected * heightUnit}PX, 0)`,
              }}
            />
          </View>
          <View className={`${prefixCls}-vertical-content`}>{tabContents}</View>
        </View>
      </View>
    );
  }

  return (
    <View className={prefixCls}>
      <View
        className={`${prefixCls}-header`}
        style={{
          ...fixedStyle,
          ...headerStyle,
        }}
      >
        {type !== 'card' && type !== 'plain' ? (
          <View className={`${prefixCls}-header-titles`}>
            <View
              className={classNames({
                [`${prefixCls}-header-titles-bg`]: true,
                [`${prefixCls}-header-titles-bg-square`]: titleSquare,
              })}
            >
              <View className={`${prefixCls}-header-titles-bg-container`}>
                {tabs.map((item: TabTitleProps) => (
                  <View
                    key={item.key}
                    className={`${prefixCls}-header-titles-bg-container-title`}
                    style={
                      {
                        fontWeight: activeKeyStr === item.key ? 500 : 400,
                        width: titleWidth ? `${titleWidth}px` : null,
                      } as React.CSSProperties
                    }
                    onTap={() => {
                      handleTabClick(item);
                    }}
                  >
                    {item.tab}
                  </View>
                ))}
                <View
                  className={`${prefixCls}-header-titles-bg-container-active`}
                  style={{
                    width: `${100 / tabs.length}%`,
                    transform: `translateX(${curIndex * 100}%)`,
                  }}
                />
              </View>
            </View>
            {extra}
          </View>
        ) : null}
        {type === 'plain' ? (
          <View
            className={classNames({
              [`${prefixCls}-header-titles-plain`]: true,
              [`${prefixCls}-header-titles-plain-center`]: titleAlign === 'center',
            })}
          >
            {tabs.map((item: TabTitleProps) => (
              <View
                key={item.key}
                className={classNames({
                  [`${prefixCls}-header-titles-plain-title`]: true,
                  [`${prefixCls}-header-titles-plain-center-title`]: titleAlign === 'center',
                  [`${prefixCls}-header-titles-plain-title-active`]: activeKeyStr === item.key,
                })}
                onTap={() => {
                  handleTabClick(item);
                }}
              >
                {item.tab}
              </View>
            ))}
          </View>
        ) : null}
        {type === 'card' ? (
          <View className={`${prefixCls}-header-titles-card`}>
            {tabs.map((item: TabTitleProps) => (
              <View
                key={item.key}
                className={classNames({
                  [`${prefixCls}-header-titles-card-title`]: true,
                  [`${prefixCls}-header-titles-card-title-active`]: activeKeyStr === item.key,
                })}
                onTap={() => {
                  handleTabClick(item);
                }}
              >
                {item.tab}
              </View>
            ))}
          </View>
        ) : null}
        <View className={`${prefixCls}-header-content`}>{headerContent}</View>
      </View>
      <View className={`${prefixCls}-content`}>{tabContents}</View>
    </View>
  );
};

const TabContent: React.FC = (props: TabContentProps): React.ReactElement | null => {
  const { active, children } = props;

  if (!active) {
    return <View style={{ display: 'none' }}>{children}</View>;
  }
  return <View>{children}</View>;
};

Tabs.TabContent = TabContent;

export default Tabs;
