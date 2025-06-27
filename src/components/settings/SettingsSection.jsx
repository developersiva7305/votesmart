import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from "@/components/ui/switch.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const SettingsSection = ({ section, idx, darkMode, settingsData, fontStyle, currentFontSize, onGenericSettingChange, onFontStyleChange, onLocalFontSizeChange, onFontSizeApplied, onToggleDarkMode }) => {
  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1 }}
    >
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
        <section.icon className="mr-3 h-6 w-6 text-blue-500 dark:text-blue-400" />
        {section.title}
      </h3>
      <div className="space-y-1">
        {section.options.map((option, optIdx) => (
          <div key={optIdx} className="p-1 rounded-lg">
            <Dialog>
              <DialogTrigger asChild={option.dialog !== undefined}>
                <div
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors
                    ${option.type === 'switch' || option.type === 'select' || option.type === 'slider' ? '' : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}
                  onClick={option.type !== 'switch' && option.type !== 'select' && option.type !== 'slider' && !option.dialog ? option.action : undefined}
                >
                  <div className="flex-grow mr-4"> 
                    <div className="flex items-center">
                      {option.icon && <option.icon className={`mr-2 h-5 w-5 ${option.variant === 'destructive' ? 'text-red-500' : 'text-blue-500 dark:text-blue-400'}`} />}
                      <div>
                        <p className={`text-sm font-medium ${option.variant === 'destructive' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'}`}>
                          {option.label}
                        </p>
                        {option.info && <p className="text-xs text-gray-500 dark:text-gray-400">{option.info}</p>}
                      </div>
                    </div>
                  </div>
                  
                  {option.type === 'switch' && (
                    <div className="flex-shrink-0 ml-auto"> {/* Added ml-auto to push to the far right */}
                      <Switch
                        id={`${section.title.replace(/\s+/g, '-')}-${option.key}`}
                        checked={option.key === 'darkMode' ? darkMode : settingsData[option.key]}
                        onCheckedChange={(checked) => {
                          if (option.key === 'darkMode') {
                            onToggleDarkMode();
                          } else {
                            onGenericSettingChange(option.key, checked);
                          }
                        }}
                        aria-label={option.label}
                        className="dark:data-[state=checked]:bg-blue-500 dark:data-[state=unchecked]:bg-gray-600"
                      />
                    </div>
                  )}
                  {option.type === 'select' && (
                     <div className="flex-shrink-0 ml-auto"> {/* Added ml-auto */}
                      <Select value={option.currentVal} onValueChange={option.action}>
                        <SelectTrigger className="w-[180px] dark:bg-gray-700 dark:text-white dark:border-gray-600">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:text-white">
                          {option.options.map(font => (
                            <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }} className="dark:hover:bg-gray-700">
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </DialogTrigger>
              {option.type === 'slider' && (
                <div className="p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`${section.title.replace(/\s+/g, '-')}-${option.key}`} className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center">
                      {option.icon && <option.icon className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400" />}
                      {option.label.substring(0, option.label.indexOf('(') > 0 ? option.label.indexOf('(') : option.label.length).trim()}
                    </Label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{currentFontSize}px</span>
                  </div>
                  <Slider
                    id={`${section.title.replace(/\s+/g, '-')}-${option.key}`}
                    min={option.min}
                    max={option.max}
                    step={option.step}
                    value={[currentFontSize]}
                    onValueChange={onLocalFontSizeChange}
                    className="my-2 dark:[&>span:first-child]:bg-blue-500"
                  />
                  <Button onClick={onFontSizeApplied} size="sm" className="mt-2 w-full user-gradient">Apply Font Size</Button>
                  {option.info && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.info}</p>}
                </div>
              )}
              {option.dialog}
            </Dialog>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SettingsSection;